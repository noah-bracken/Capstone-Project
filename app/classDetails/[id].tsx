import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import styles from '../components/styles';

const API_URL = 'https://capstone-db-lb2e.onrender.com';

// Define the structure of class data
interface ClassData {
  class_name: string;
  students: { user_id: number; first_name: string; last_name: string }[];
}

export default function ClassScreen() {
  const { id } = useLocalSearchParams(); // Get class ID from URL
  const router = useRouter();
  
  // Specify the correct type for `classData`
  const [classData, setClassData] = useState<ClassData | null>(null);

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

    fetchClassData();
  }, [id]);

  // Show loading state
  if (!classData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>NOMark</Text>
      <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/')}>
        <Text style={styles.buttonText}>↩ Home Page</Text>
      </TouchableOpacity>

      {/* Show Class Name Instead of ID */}
      <Text style={styles.classTitle}>{classData.class_name}</Text>

      {/* Display List of Students */}
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

      {/* Manage Class Settings */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => router.push(`/classDetails/${id}/settings`)}
      >
        <Text style={styles.buttonText}>Manage Class Settings</Text>
      </TouchableOpacity>
    </View>
  );
}
