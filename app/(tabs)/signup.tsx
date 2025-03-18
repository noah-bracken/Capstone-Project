import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { registerUser } from '../../hooks/auth'; // Import registration function
import styles from '../components/styles';

export default function SignupScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Default role

  const handleSignup = async () => {
    const result = await registerUser(firstName, lastName, email, password, role);
    
    if (result) {
      Alert.alert('Success', 'Account created successfully! Please log in.');
      router.push('/login'); // Redirect to login page after signup
    } else {
      Alert.alert('Error', 'Signup failed. Try again.');
    }
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

      {/* Role Selection */}
      <View style={styles.roleSelection}>
        <TouchableOpacity onPress={() => setRole('student')} style={[styles.roleButton, role === 'student' && styles.selectedRole]}>
          <Text>Student</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRole('teacher')} style={[styles.roleButton, role === 'teacher' && styles.selectedRole]}>
          <Text>Teacher</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addClassButton} onPress={handleSignup}>
        <Text style={styles.addClassText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.linkText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}
