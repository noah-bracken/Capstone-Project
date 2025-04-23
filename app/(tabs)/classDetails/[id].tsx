// [id].tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../../components/capstone/styles';
import { ClassType } from '../../../components/capstone/types';
import AttendanceQRCode from '../../../components/capstone/ClassQRCode';
import ClassCodeModal from './[classID]/classCode';
import PrintQRCode from './[classID]/PrintQRCode';
import QuartileGaugeLayout from '../../../components/capstone/GaugeLayout';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


const API_URL = 'https://capstone-db-lb2e.onrender.com';

interface ClassData extends ClassType {
  students: { user_id: number; first_name: string; last_name: string }[];
  teacher_name?: string;
  meeting_times?: { day: string; time: string }[];
  latest_qr_id: number; 
}

export default function ClassScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [attendanceSummary, setAttendanceSummary] = useState<{
    totalAttendance: number;
    recentAttendance: number;
  } | null>(null);
  const [studentStatuses, setStudentStatuses] = useState<{ [key: number]: 'present' | 'late' | 'absent' | null }>({});
  const [withinWindow, setWithinWindow] = useState(false);

  const isWithinAttendanceWindow = () => {
    if (!classData?.meeting_times) return false;
  
    const now = new Date();
    const today = now.toLocaleString('en-US', { weekday: 'long' });
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
    return classData.meeting_times.some((mt: any) => {
      if (mt.day !== today) return false;
  
      const [hourStr, minuteStr] = mt.time.split(':');
      const scheduledMinutes = parseInt(hourStr) * 60 + parseInt(minuteStr);
  
      return currentMinutes >= scheduledMinutes - 15 && currentMinutes <= scheduledMinutes + 15;
    });
  };

  const withinAttendanceWindow = isWithinAttendanceWindow();

  const fetchAttendanceSummary = async () => {
      if (!sessionToken || !id) return;
      try {
        const response = await fetch(`${API_URL}/classes/${id}/attendance-summary`, {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        });
        const data = await response.json();
        setAttendanceSummary(data);
      } catch (error) {
        console.error('Error fetching attendance summary:', error);
      }
    };

    const fetchCurrentAttendance = async (
      qrId?: number,
      students?: ClassData['students']
    ) => {
      const qr_id = qrId ?? classData?.latest_qr_id;
      const studentList = students ?? classData?.students;
      if (!qr_id || !sessionToken || !studentList) return;
    
      try {
        const res = await fetch(`${API_URL}/sessions/${qr_id}/attendance`, {
          headers: { Authorization: `Bearer ${sessionToken}` },
        });
    
        const data = await res.json();
        const newStatuses: { [key: number]: 'present' | 'late' | 'absent' } = {};
    
        // Default all students to 'absent'
        studentList.forEach((s) => {
          newStatuses[s.user_id] = 'absent';
        });
    
        // Override with real attendance
        data.forEach((entry: any) => {
          newStatuses[entry.student_id] = entry.status;
        });
    
        setStudentStatuses(newStatuses);
      } catch (err) {
        console.error('Error fetching current attendance:', err);
      }
    };

  useFocusEffect(
    useCallback(() => {
      if (role === 'teacher' && sessionToken && classData?.latest_qr_id) {
        fetchCurrentAttendance();
        fetchAttendanceSummary();
      }
    }, [role, sessionToken, classData?.latest_qr_id])
  );

  // Get role and token
  useEffect(() => {
    const getRoleAndToken = async () => {
      const storedRole = await AsyncStorage.getItem('role');
      const token = await AsyncStorage.getItem('token');
      setRole(storedRole);
      setSessionToken(token);
    };
    getRoleAndToken();
  }, []);

  // When token is ready, fetch attendance summary
  useEffect(() => {
    fetchAttendanceSummary();
  }, [sessionToken, id]);

  // Fetch class data
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await fetch(`${API_URL}/classes/${id}`);
        const data = await response.json();
        setClassData(data);
        console.log('Fetched class data:', data);
      } catch (error) {
        console.error('Error fetching class details:', error);
      }
    };
    if (id) fetchClassData();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (role !== 'teacher') return;
      try {
        const [classRes, attendanceRes] = await Promise.all([
          fetch(`${API_URL}/classes/${id}`),
          fetch(`${API_URL}/classes/${id}/attendance-summary`, {
            headers: {
              Authorization: `Bearer ${sessionToken}`,
            },
          }),
        ]);
  
        const classJson = await classRes.json();
        const attendanceJson = await attendanceRes.json();
  
        setClassData(classJson);
        setAttendanceSummary(attendanceJson);
        await fetchCurrentAttendance(classJson.latest_qr_id, classJson.students);
  
        // Recalculate attendance window
        if (classJson.meeting_times) {
          const now = new Date();
          const today = now.toLocaleString('en-US', { weekday: 'long' });
          const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
          const isActive = classJson.meeting_times.some((mt: any) => {
            if (mt.day !== today) return false;
            const [hourStr, minuteStr] = mt.time.split(':');
            const scheduledMinutes = parseInt(hourStr) * 60 + parseInt(minuteStr);
            return currentMinutes >= scheduledMinutes - 15 && currentMinutes <= scheduledMinutes + 15;
          });
  
          setWithinWindow(isActive);
        }
      } catch (err) {
        console.error('Auto-refresh error:', err);
      }
    }, 15000);
  
    return () => clearInterval(interval);
  }, [id, sessionToken, role]);

  if (!classData || !role || !sessionToken) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }
  
  const markAttendance = async (
  studentId: number,
  status: 'present' | 'absent' | 'late'
) => {
  if (!classData?.latest_qr_id) {
    console.warn("QR session is missing.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/attendance/manual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        class_id: id,
        qr_id: classData.latest_qr_id,
        student_id: studentId,
        status,
      }),
    });
    const data = await response.json();
    console.log('Marked attendance:', data);

    await fetchCurrentAttendance();
    await fetchAttendanceSummary();

  } catch (error) {
    console.error('Error marking attendance:', error);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>NOMark</Text>
      <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/')}>
        <Text style={styles.buttonText}>↩ Home Page</Text>
      </TouchableOpacity>

      <Text style={styles.classTitle}>{classData.class_name}</Text>
      {role === 'student' && classData.teacher_name && (
        <Text style={styles.subtitle}>Taught by {classData.teacher_name}</Text>
      )}

      {role === 'teacher' && attendanceSummary && (
        <View style={{ height: 200, width: '100%', position: 'relative' }}>
          <QuartileGaugeLayout
            total={attendanceSummary.totalAttendance}
            recent={attendanceSummary.recentAttendance}
          />
        </View>
      )}

      {classData.meeting_times && classData.meeting_times.length > 0 && (
        <View style={styles.meetingTimesBox}>
          <Text style={styles.sectionTitle}>Meeting Times:</Text>
          {classData.meeting_times.map((mt, index) => {
            const isActive = withinAttendanceWindow;
            const formattedTime = new Date(`1970-01-01T${mt.time}`).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            });

            return (
              <Text key={index} style={styles.meetingTimeText}>
                • {mt.day} at {formattedTime} {isActive && <Text style={styles.activeMeeting}>— active</Text>}
              </Text>
            );
          })}
        </View>
      )}

      {role === 'teacher' ? (
        <>
          <View style={styles.studentList}>
            <Text style={styles.sectionTitle}>Students:</Text>
            {!classData.students || classData.students.length === 0 ? (
              <Text style={styles.studentItem}>No students enrolled yet.</Text>
            ) : (
              classData.students.map((student) => (
                <View key={student.user_id} style={styles.studentCard}>
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => router.push(`./studentDetails/${student.user_id}`)}
                  >
                    <Text style={styles.studentName}>
                      {student.first_name} {student.last_name}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.attendanceButtons}>
                    <TouchableOpacity
                      style={[
                        styles.attendanceButton,
                        {
                          backgroundColor:
                            studentStatuses[student.user_id] === 'present'
                              ? '#065F46'
                              : withinAttendanceWindow && classData.latest_qr_id ? '#10B981' : '#9CA3AF',
                        },
                      ]}
                      disabled={!withinAttendanceWindow}
                      onPress={() => markAttendance(student.user_id, 'present')}
                    >
                      <Text style={styles.buttonText}>P</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.attendanceButton,
                        {
                          backgroundColor:
                            studentStatuses[student.user_id] === 'late'
                              ? '#92400E'
                              : withinAttendanceWindow && classData.latest_qr_id ? '#FBBF24' : '#9CA3AF',
                        },
                      ]}
                      disabled={!withinAttendanceWindow}
                      onPress={() => markAttendance(student.user_id, 'late')}
                    >
                      <Text style={styles.buttonText}>L</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.attendanceButton,
                        {
                          backgroundColor:
                            studentStatuses[student.user_id] === 'absent'
                              ? '#7F1D1D'
                              : withinAttendanceWindow && classData.latest_qr_id ? '#EF4444' : '#9CA3AF',
                        },
                      ]}
                      disabled={!withinAttendanceWindow}
                      onPress={() => markAttendance(student.user_id, 'absent')}
                    >
                      <Text style={styles.buttonText}>A</Text>
                    </TouchableOpacity>
                  </View>

                </View>
              ))
            )}
          </View>

          {withinAttendanceWindow && classData.latest_qr_id && <AttendanceQRCode classId={id} />}

          {Platform.OS === 'web' && classData.latest_qr_id && withinAttendanceWindow && (
            <PrintQRCode classId={id as string} sessionToken={sessionToken} />
          )}

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push(`/classDetails/${id}/pastSession`)}
          >
            <Text style={styles.buttonText}>📅 View Past Sessions</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.homeButton} onPress={() => setShowCodeModal(true)}>
            <Text style={styles.buttonText}>Show Class Code</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => router.push(`/classDetails/${id}/settings`)}
          >
            <Text style={styles.buttonText}>⚙️</Text>
          </TouchableOpacity>

          <ClassCodeModal
            visible={showCodeModal}
            classCode={classData.class_id}
            onClose={() => setShowCodeModal(false)}
          />
        </>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Student Options:</Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push(`/classDetails/${id}/scanAttendance`)}
          >
            <Text style={styles.buttonText}>📷 Scan Attendance</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push(`/classDetails/${id}/attendanceHistory`)}
          >
            <Text style={styles.buttonText}>📊 View Attendance History</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}