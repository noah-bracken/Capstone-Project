import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, Alert as RNAlert } from 'react-native';
import { useRouter } from 'expo-router';
import { registerUser } from '../hooks/auth';
import styles from './components/styles';
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import { storeDeviceId } from '../hooks/api';

// Cross-platform alert utility
const showAlert = (title: string, message: string) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}: ${message}`);
  } else {
    RNAlert.alert(title, message);
  }
};

export default function SignupScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');

  const handleSignup = async () => {
    const result = await registerUser(firstName, lastName, email, password, role);
  
    if (!result) {
      showAlert('Error', 'Signup failed. Try again.');
      return;
    }
  
    showAlert('Success', 'Account created successfully! Please log in.');
  
    if (Platform.OS !== 'web') {
      const currentId = Device.osInternalBuildId;
  
      if (currentId) {
        try {
          await SecureStore.setItemAsync('device_id', currentId);
          await storeDeviceId(result.user_id, currentId);
        } catch (err) {
          console.error('Failed to register device after signup:', err);
          showAlert('Warning', 'Account created, but device could not be registered.');
        }
      } else {
        showAlert('Warning', 'Account created, but device ID was not found.');
      }
    }
  
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.roleSelection}>
        <TouchableOpacity
          onPress={() => setRole('student')}
          style={[styles.roleButton, role === 'student' && styles.selectedRole]}
        >
          <Text>Student</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setRole('teacher')}
          style={[styles.roleButton, role === 'teacher' && styles.selectedRole]}
        >
          <Text>Teacher</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.linkText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}
