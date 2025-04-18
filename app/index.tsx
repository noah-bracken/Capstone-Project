import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { useClassContext } from '../context/ClassContext';
import { getToken } from '../hooks/auth';
import { fetchUserAcceptanceStatus, acceptTerms } from '../hooks/api';
import styles from '../components/capstone/styles';
import JoinModal from '../components/capstone/joinClass';
import AnimatedClassCard from '../components/capstone/AnimatedButton';
import ReminderBanner from '../components/capstone/ReminderBanner';
import { useClassReminders } from '../hooks/useClassReminders';
import TermsModal from '../components/capstone/TermsModal';

export default function HomeScreen() {
  const router = useRouter();
  const { classes, refreshClasses } = useClassContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const { reminder, clearReminder, goToAction } = useClassReminders(role);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);  
  const [firstName, setFirstName] = useState('');
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        const token = await getToken();
        const storedRole = await AsyncStorage.getItem('role');
        const storedFirstName = await AsyncStorage.getItem('firstName');
        const storedId = await AsyncStorage.getItem('user_id');
        const { user_id, has_accepted_terms } = await fetchUserAcceptanceStatus();
        setUserId(user_id);
        if (!has_accepted_terms) {
          setShowTermsModal(true);
        }
        if (storedId) setUserId(Number(storedId));

        if (!token) {
          router.replace('/login');
        } else {
          setIsAuthenticated(true);
          setRole(storedRole);
          if (storedFirstName) setFirstName(storedFirstName);
          await refreshClasses();
        }
  
        setLoading(false);
      } catch (err) {
        console.error("Error in auth check:", err);
        router.push("/login");
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
      <View style={styles.headerContainer}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.sectionTitle}>Welcome back, {firstName || 'User'}!</Text>
      </View>

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
      <TermsModal
        visible={showTermsModal}
        onAccept={async () => {
          try {
            if (userId) {
              await acceptTerms(userId);
              setShowTermsModal(false);
            }
          } catch (err) {
            console.error("Error accepting terms:", err);
          }
        }}
        onDecline={async () => {
          await AsyncStorage.clear();
          router.replace('/login');
        }}
      />
    </View>
  );
}