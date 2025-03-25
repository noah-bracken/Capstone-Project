import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { login } from '../../hooks/auth';
import styles from '../components/styles';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log("Attempting to login...");
  
    const result = await login(email, password);
    
    if (!result) {
      Alert.alert('Error', 'Invalid email or password');
      return;
    }
    Alert.alert('Login Successful', 'Welcome back!');
    router.push('/');  // Ensure router navigation is executed
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

      <TouchableOpacity style={styles.addClassButton} onPress={handleLogin}>
        <Text style={styles.addClassText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/signup')}>
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}
