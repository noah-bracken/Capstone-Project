import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../components/styles';
import { ClassType } from '../../types';
import AttendanceQRCode from '../../components/ClassQRCode';
import ClassCodeModal from './[id]/classCode'; // 

const API_URL = 'https://capstone-db-lb2e.onrender.com';

interface ClassData extends ClassType {
  students: { user_id: number; first_name: string; last_name: string }[];
}

export default function ClassScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [role, setRole] = useState<string | null>(null);

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
    const getRole = async () => {
      const storedRole = await AsyncStorage.getItem('role');
      setRole(storedRole);
    };

    fetchClassData();
    getRole();
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
  
      {role === 'teacher' ? (
        <>
        
          <View style={styles.studentList}>
            <Text style={styles.sectionTitle}>Students:</Text>
            {classData.students.length > 0 ? (
              classData.students.map((student) => (
                <Text key={student.user_id} style={styles.studentItem}>
                  • {student.first_name} {student.last_name}
                </Text>
              ))
            ) : (
              <Text style={styles.studentItem}>No students enrolled yet.</Text>
            )}
          </View>
  
          {/* QR Code Generation */}
          <AttendanceQRCode classId={id} />

          {/* Show Class Code Button */}
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => setShowCodeModal(true)}
          >
            <Text style={styles.buttonText}>Show Class Code</Text>
          </TouchableOpacity>

          {/* Manage Settings */}
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => router.push(`/classDetails/${id}/settings`)}
          >
            <Text style={styles.buttonText}>⚙️</Text>
          </TouchableOpacity>

          {/* Class Code Modal */}
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
