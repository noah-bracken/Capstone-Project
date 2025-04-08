import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const API_URL = 'https://capstone-db-lb2e.onrender.com';

export const useClassReminders = (role: string | null) => {
  const [reminder, setReminder] = useState<null | { classId: string; className: string }>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUpcoming = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${API_URL}/classes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const classes = await response.json();
        const now = new Date();

        for (const cls of classes) {
          const timesRes = await fetch(`${API_URL}/classes/${cls.class_id}/meeting-times`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const times = await timesRes.json();

          for (const { day, time } of times) {
            const meetingDate = getNextMeetingDate(day, time);
            const diff = meetingDate.getTime() - now.getTime();
            console.log(`[DEBUG] ${cls.class_name} → ${meetingDate.toString()} | Diff: ${Math.floor(diff / 60000)} min`);

            if (diff > 0 && diff < 15 * 60 * 1000) {
              setReminder({ classId: cls.class_id, className: cls.class_name });
              return;
            }
          }
        }
      } catch (err) {
        console.error("Reminder check error:", err);
      }
    };

    const interval = setInterval(checkUpcoming, 60000); // check every 1 min
    checkUpcoming(); // run immediately

    return () => clearInterval(interval);
  }, [role]);

  const getNextMeetingDate = (dayStr: string, timeStr: string) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const [hour, minute] = timeStr.split(':').map(Number);
    const now = new Date();
    const currentDay = now.getDay();
    const targetDay = days.indexOf(dayStr);
    const meetingDate = new Date(now);

    let dayOffset = (targetDay - currentDay + 7) % 7;

    // If today, check whether the meeting time has already passed
    if (dayOffset === 0) {
      const hasPassedToday =
        now.getHours() > hour ||
        (now.getHours() === hour && now.getMinutes() >= minute);

      if (hasPassedToday) {
        dayOffset = 7; // schedule for next week
      }
    }

    meetingDate.setDate(now.getDate() + dayOffset);
    meetingDate.setHours(hour, minute, 0, 0);

    return meetingDate;
  };

  return {
    reminder,
    clearReminder: () => setReminder(null),
    goToAction: () => {
      if (!reminder) return;

      router.push({
        pathname: `/classDetails/[id]`,
        params: { id: reminder.classId },
      });
    },
  };
};
