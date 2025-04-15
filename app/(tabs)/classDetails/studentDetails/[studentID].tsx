import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../../../components/capstone/styles';

const API_URL = 'https://capstone-db-lb2e.onrender.com';

export default function StudentDetails() {
  const { id, studentID } = useLocalSearchParams();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStudent = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const res = await fetch(`${API_URL}/students/${studentID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setStudent(data);
      } catch (err) {
        console.error('Error fetching student:', err);
      } finally {
        setLoading(false);
      }
    };

    if (studentID) fetchStudent();
  }, [studentID]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.container}>
        <Text>Student not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NOMark</Text>
      <TouchableOpacity style={styles.homeButton} onPress={() => router.back()}>
        <Text style={styles.buttonText}>↩ Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Student Details</Text>
      <Text style={styles.text}>Name: {student.first_name} {student.last_name}</Text>
      <Text style={styles.text}>Email: {student.email}</Text>
    </View>
  );
}
