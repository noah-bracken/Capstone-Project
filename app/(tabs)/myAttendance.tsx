import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { getMyAttendance } from './api'; // adjust path if needed
import styles from '../components/styles';

export default function MyAttendance() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      const data = await getMyAttendance();
      setRecords(data);
    };
    fetchAttendance();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Attendance</Text>
      {records.length === 0 ? (
        <Text>No records yet</Text>
      ) : (
        records.map((rec, index) => (
          <View key={index} style={styles.attendanceItem}>
            <Text style={styles.classTitle}>Class: {rec.class_name}</Text>
            <Text>Status: {rec.status}</Text>
            <Text>Scanned at: {new Date(rec.scanned_at).toLocaleString()}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}
