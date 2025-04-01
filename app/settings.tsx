import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './components/styles';
import { useAuth } from '../hooks/useAuth';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/')}> 
        <Text style={styles.buttonText}>↩ Home Page</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
