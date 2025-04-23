import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AttendanceGauge from '../../../../components/capstone/AttendanceGauge';
import { useRouter } from 'expo-router';

const API_URL = 'https://capstone-db-lb2e.onrender.com';

type SessionInfo = {
        qr_id: number;
        generated_at: string;
        class_id: string;
        class_name: string;
      };

type AttendanceEntry = {
attendance_id: number;
student_id: number;
first_name: string;
last_name: string;
status: 'present' | 'late' | 'absent';
timestamp?: string;
};
      
export default function PastSessionViewer() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [selectedSession, setSelectedSession] = useState<SessionInfo | null>(null);
  const [attendance, setAttendance] = useState<AttendanceEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const tryFetch = async () => {
      const teacher_id = await AsyncStorage.getItem('user_id');
      const token = await AsyncStorage.getItem('token');
  
      if (!teacher_id || !token) {
        console.warn('Missing teacher_id or token in local storage.');
        return;
      }
  
      // Only fetch sessions if both exist
      fetchSessionsForDate(teacher_id, token);
    };
  
    tryFetch();
  }, [date]);
  

  const fetchSessionsForDate = async (teacher_id: string, token: string) => {
    setSelectedSession(null);
    setAttendance([]);
    setLoading(true);
  
    const response = await fetch(`${API_URL}/teachers/${teacher_id}/past-classes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    const classes = await response.json();
    const sessionsToShow: SessionInfo[] = [];

    for (const cls of classes) {
        const res = await fetch(`${API_URL}/classes/${cls.class_id}/sessions`, {
            headers: { Authorization: `Bearer ${token}` },
          });          
        const result = await res.json();
        
        // Support both array or object with array
        const sessionArray = Array.isArray(result) ? result : result.sessions || [];
        
        const uniqueSessionsMap = new Map<number, SessionInfo>();

        sessionArray.forEach((s: SessionInfo) => {
            const sessionDate = new Date(s.generated_at);
                const selectedDate = new Date(date);
                if (
                sessionDate.toDateString() === selectedDate.toDateString()
                ) {
                if (!uniqueSessionsMap.has(s.qr_id)) {
                    uniqueSessionsMap.set(s.qr_id, { ...s, class_name: cls.class_name, class_id: cls.class_id });
                }
            }       
        });
        sessionsToShow.push(...uniqueSessionsMap.values());
    }
  
    setSessions(sessionsToShow);
    setLoading(false);
  };
  
  
  const loadAttendance = async (session: SessionInfo) => {
    setSelectedSession(session);
    setLoading(true);
  
    try {
      const token = await AsyncStorage.getItem('token');
  
      const response = await fetch(`${API_URL}/sessions/${session.qr_id}/attendance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        console.error('Failed to fetch attendance:', response.status, await response.text());
        setLoading(false);
        return;
      }
  
      const data = await response.json();
      setAttendance(data);
    } catch (err) {
      console.error('Error loading attendance:', err);
    } finally {
      setLoading(false);
    }
  };  

  const updateAttendance = async (student_id: number, newStatus: 'present' | 'late' | 'absent') => {
    if (!selectedSession) return;
  
    const token = await AsyncStorage.getItem('token');
  
    await fetch(`${API_URL}/attendance/manual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        class_id: selectedSession.class_id,
        qr_id: selectedSession.qr_id,
        student_id,
        status: newStatus,
      }),
    });
  
    loadAttendance(selectedSession);
  };

  const computeAttendancePercent = () => {
    if (!attendance.length) return 0;
    const present = attendance.filter((a) => a.status === 'present' || a.status === 'late').length;
    return Math.round((present / attendance.length) * 100);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>View Past Class Sessions</Text>
      <TouchableOpacity style={styles.homeButton} onPress={() => router.back()}>
        <Text style={styles.buttonText}>↩ Back</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateButton}>
        <Text style={styles.buttonText}>📅 Select Date: {date.toDateString()}</Text>
      </TouchableOpacity>

    {showPicker && (
    Platform.OS === 'web' ? (
        <DatePicker
        selected={date}
        onChange={(selected) => {
            setDate(selected as Date);
            setShowPicker(false);
        }}
        inline
        />
    ) : (
        <DateTimePicker
        value={date}
        mode="date"
        display="default"
        onChange={(e, selected) => {
            setShowPicker(Platform.OS === 'ios');
            if (selected) {
                setDate(selected);
            }
        }}
        />
    )
    )}

    {loading && <ActivityIndicator size="large" color="#1E3A8A" />}

    {!loading && sessions.length > 0 && (
    <View>
        <Text style={styles.subtitle}>Select a session:</Text>
        {sessions.map((s) => (
        <TouchableOpacity
            key={s.qr_id}
            onPress={() => loadAttendance(s)}
            style={styles.sessionItem}
        >
            <Text>
                {s.class_name} — {new Date(s.generated_at).toLocaleString('en-US', {
                  timeZone: 'America/New_York',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
                </Text>
        </TouchableOpacity>
        ))}
    </View>
    )}

      {selectedSession && (
        <View>
          <AttendanceGauge
            percentage={computeAttendancePercent()}
            label={`Attendance for ${selectedSession.class_name}`}
          />

          <Text style={styles.subtitle}>Student Attendance:</Text>
          {attendance.map((a) => (
            <View key={a.attendance_id} style={styles.studentRow}>
              <Text style={{ flex: 1 }}>{a.first_name} {a.last_name}</Text>
              <View style={styles.statusButtons}>
              {['present', 'late', 'absent'].map((status) => (
                <TouchableOpacity
                    key={status}
                    onPress={() => updateAttendance(a.student_id, status as 'present' | 'late' | 'absent')}
                    style={[
                    styles.statusButton,
                    a.status === status && styles.activeStatus,
                    ]}
                >
                    <Text style={styles.statusText}>{status[0].toUpperCase()}</Text>
                </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 20,
    fontWeight: '600',
  },
  dateButton: {
    backgroundColor: '#2563EB',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  sessionItem: {
    padding: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    marginVertical: 4,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  statusButton: {
    padding: 6,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    borderRadius: 4,
    marginLeft: 4,
  },
  activeStatus: {
    backgroundColor: '#93C5FD',
    borderColor: '#3B82F6',
  },
  statusText: {
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  homeButton: {
    backgroundColor: '#4C1D95',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
});
