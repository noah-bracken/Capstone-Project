import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, Alert as RNAlert } from 'react-native';
import { useRouter } from 'expo-router';
import { login } from '../hooks/auth';
import styles from './components/styles';
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import { storeDeviceId } from '../hooks/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const showAlert = (title: string, message: string) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}: ${message}`);
  } else {
    RNAlert.alert(title, message);
  }
};

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log("Attempting to login...");
  
    const result = await login(email, password);
  
    if (!result) {
      showAlert('Error', 'Invalid email or password');
      return;
    }
  
    const { token, role, user_id, first_name } = result;

    console.log('✅ Got login result:', result);

    if (first_name) {
      await AsyncStorage.setItem('firstName', first_name);
      console.log('✅ Stored first name:', first_name);
    }
    console.log("Token & Role Stored:", token, role);
  
    showAlert('Login Successful', 'Welcome back!');
  
    if (Platform.OS !== 'web') {
      const currentId = Device.osInternalBuildId;
      const storedId = await SecureStore.getItemAsync('device_id');
  
      if (storedId && storedId !== currentId) {
        showAlert('Error', 'This account is locked to another device.');
        return;
      }
  
      if (currentId) {
        if (!storedId) {
          await SecureStore.setItemAsync('device_id', currentId);
        }
  
        try {
          console.log('Binding device', user_id, currentId);
          await storeDeviceId(user_id, currentId);
        } catch (err) {
          console.error('Failed to bind device during login:', err);
          showAlert('Error', 'Failed to bind this device.');
          return;
        }
      } else {
        showAlert('Error', 'Device ID could not be retrieved.');
        return;
      }
    }
  
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to NOMark</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/signup')}>
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}
