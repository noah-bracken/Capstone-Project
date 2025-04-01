import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { useClassContext } from './context/ClassContext';
import { getToken } from '../hooks/auth';
import styles from './components/styles';
import JoinModal from './components/joinClass';
import AnimatedClassCard from './components/AnimatedButton';
import ReminderBanner from './components/ReminderBanner';
import { useClassReminders } from '../hooks/useClassReminders';

export default function HomeScreen() {
  const router = useRouter();
  const { classes, refreshClasses } = useClassContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const { reminder, clearReminder, goToAction } = useClassReminders(role);


  useEffect(() => {
    const checkAuth = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();

        const token = await getToken();
        const storedRole = await AsyncStorage.getItem('role');

        if (!token) {
          router.replace('/login');
        } else {
          setIsAuthenticated(true);
          setRole(storedRole);
          await refreshClasses();
        }

        setLoading(false);
      } catch (err) {
        console.error("Error in auth check:", err);
      } finally {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await SplashScreen.hideAsync();
      }
    };

    checkAuth();
  }, []);

  if (!isAuthenticated || loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NOMark</Text>

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => router.push('/settings')}
      >
        <Text style={styles.buttonText}>⚙️</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Your Classes</Text>

      <ScrollView contentContainerStyle={styles.classCardContainer}>
        {classes.length > 0 ? (
          classes.map((cls) => (
            <AnimatedClassCard key={cls.class_id} cls={cls} />
          ))
        ) : (
          <Text>No classes available</Text>
        )}
      </ScrollView>

      {role === 'teacher' ? (
        <TouchableOpacity
          style={styles.addClassButton}
          onPress={() => router.push('/addClass')}
        >
          <Text style={styles.addClassText}>+ Add Class</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => setShowJoinModal(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>+ Join Class</Text>
          </TouchableOpacity>

          <JoinModal
            visible={showJoinModal}
            onCancel={() => setShowJoinModal(false)}
          />
        </>
      )}
      {reminder && (
        <ReminderBanner
          className={reminder.className}
          onPress={() => {
            goToAction();
            clearReminder();
          }}
        />
      )}
    </View>
  );
}