import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, Alert as RNAlert } from 'react-native';
import { useRouter } from 'expo-router';
import { login } from '../hooks/auth';
import styles from './components/styles';

// Cross-platform alert utility
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

    showAlert('Login Successful', 'Welcome back!');
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
