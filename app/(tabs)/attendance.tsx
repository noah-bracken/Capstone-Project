import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getAttendanceForClass, markAttendance } from './api'; // adjust path if needed
import styles from '../components/styles';

export default function AttendanceScreen() {
  const { id } = useLocalSearchParams(); // class ID from router
  const [attendance, setAttendance] = useState([]);

  const fetchData = async () => {
    const data = await getAttendanceForClass(Number(id));
    setAttendance(data);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleMark = async (studentId: number, status: string) => {
    await markAttendance(Number(id), studentId, status);
    fetchData();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Class Attendance</Text>

      {attendance.length === 0 ? (
        <Text>No attendance yet.</Text>
      ) : (
        attendance.map((record) => (
          <View key={record.attendance_id} style={styles.attendanceItem}>
            <Text style={styles.classTitle}>
              {record.first_name} {record.last_name}
            </Text>
            <Text>Status: {record.status}</Text>
            <Text>Scanned at: {new Date(record.scanned_at).toLocaleString()}</Text>

            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
              {['present', 'late', 'absent'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={styles.settingsButton}
                  onPress={() => handleMark(record.student_id, status)}
                >
                  <Text style={styles.buttonText}>{status}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}
