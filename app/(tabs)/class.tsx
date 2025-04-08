import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../components/styles'; // Import styles.ts
import TimeSettings from '../components/TimeSettings'

export default function ClassScreen() {
    const router = useRouter();
  
    // Dummy class data
    const classData = { id: 1, name: 'Math 101', students: ['Alice', 'Bob', 'Sara', 'Noah', 'Michael', 'Owen'] };
    const [showStudents, setShowStudents] = useState(false);
    const [showTimeSettings, setShowTimeSettings] = useState(false);
  
    return (
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.title}>NOMark</Text>
        <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/')}>
          <Text style={styles.buttonText}>↩ Home Page</Text>
        </TouchableOpacity>
  
        {/* Class Name */}
        <Text style={styles.classTitle}>{classData.name}</Text>
  
        {/* Show Students List */}
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowStudents(!showStudents)}
        >
          <Text style={styles.buttonText}>{showStudents ? 'Hide Students' : 'List of Students'}</Text>
        </TouchableOpacity>
  
        {/* Display Students */}
        {showStudents && (
          <View style={styles.studentList}>
            {classData.students.map((student, index) => (
              <Text key={index} style={styles.studentItem}>• {student}</Text>
            ))}
          </View>
        )}
  
        {/* Manage Class Settings */}
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setShowTimeSettings(!showTimeSettings)}
        >
          <Text style={styles.buttonText}>Manage Class Settings</Text>
        </TouchableOpacity>
  
        {/* Time Settings Component */}
        {showTimeSettings && <TimeSettings />}
      </View>
    );
  }
  