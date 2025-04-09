import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../../components/capstone/styles';
import { ClassType } from '../../types';
import AttendanceQRCode from '../../../components/capstone/ClassQRCode';
import ClassCodeModal from './[id]/classCode';
import PrintQRCode from './[id]/PrintQRCode';

const API_URL = 'https://capstone-db-lb2e.onrender.com';

interface ClassData extends ClassType {
  students: { user_id: number; first_name: string; last_name: string }[];
  teacher_name?: string;
  meeting_times?: { day: string; time: string }[];

}

export default function ClassScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await fetch(`${API_URL}/classes/${id}`);
        const data = await response.json();
        setClassData(data);
      } catch (error) {
        console.error('Error fetching class details:', error);
      }
    };

    const getRoleAndToken = async () => {
      const storedRole = await AsyncStorage.getItem('role');
      const token = await AsyncStorage.getItem('token');
      setRole(storedRole);
      setSessionToken(token);
    };

    fetchClassData();
    getRoleAndToken();
  }, [id]);

  if (!classData || !role) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NOMark</Text>
      <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/')}>
        <Text style={styles.buttonText}>↩ Home Page</Text>
      </TouchableOpacity>

      <Text style={styles.classTitle}>{classData.class_name}</Text>
      {role === 'student' && classData.teacher_name && (
        <Text style={styles.subtitle}>
          Taught by {classData.teacher_name}
        </Text>
      )}
      {classData.meeting_times && classData.meeting_times.length > 0 && (
      <View style={styles.meetingTimesBox}>
        <Text style={styles.sectionTitle}>Meeting Times:</Text>
        {classData.meeting_times.map((mt, index) => (
          <Text key={index} style={styles.meetingTimeText}>
            • {mt.day} at {mt.time}
          </Text>
        ))}
      </View>
    )}
      {role === 'teacher' ? (
        <>
          <View style={styles.studentList}>
            <Text style={styles.sectionTitle}>Students:</Text>
            {classData.students.length > 0 ? (
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
                      style={[styles.attendanceButton, { backgroundColor: '#10B981' }]}
                      onPress={() => console.log('Present', student.user_id)}
                    >
                      <Text style={styles.buttonText}>P</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.attendanceButton, { backgroundColor: '#FBBF24' }]}
                      onPress={() => console.log('Late', student.user_id)}
                    >
                      <Text style={styles.buttonText}>L</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.attendanceButton, { backgroundColor: '#EF4444' }]}
                      onPress={() => console.log('Absent', student.user_id)}
                    >
                      <Text style={styles.buttonText}>A</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.studentItem}>No students enrolled yet.</Text>
            )}
          </View>

          {/* QR Code Generator */}
          <AttendanceQRCode classId={id} />

          {/* 🖨️ Print QR Code */}
          {Platform.OS === 'web' && sessionToken && (
            <PrintQRCode classId={id as string} sessionToken={sessionToken} />
          )}

          {/* Show Class Code */}
          <TouchableOpacity style={styles.homeButton} onPress={() => setShowCodeModal(true)}>
            <Text style={styles.buttonText}>Show Class Code</Text>
          </TouchableOpacity>

          {/* ⚙️ Settings */}
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => router.push(`/classDetails/${id}/settings`)}
          >
            <Text style={styles.buttonText}>⚙️</Text>
          </TouchableOpacity>

          {/* Modal */}
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
