import React from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../components/styles'

export default function HomeScreen() {
  const router = useRouter(); // Used for navigation

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.companyName}>NOMark</Text>
        <Text style={styles.welcome}>Welcome, {"<Teacher's Name>"}</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('./settings')}>
          <Text style={styles.settingsIcon}>⚙</Text>
        </TouchableOpacity>
      </View>

      {/* Classes Section */}
      <ScrollView style={styles.classes}>
        <View style={styles.classesHeader}>
          <Text style={styles.sectionTitle}>Classes</Text>
          <TouchableOpacity style={styles.addClassButton} onPress={() => router.push('/addClass')}>
            <Text style={styles.addClassText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Class Buttons */}
        <TouchableOpacity style={styles.classButton} onPress={() => router.push('./class')}>
          <Text style={styles.classButtonText}>Class 1</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.classButton} onPress={() => router.push('./class')}>
          <Text style={styles.classButtonText}>Class 2</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}