import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  Alert as RNAlert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import styles from '../components/capstone/styles';
import { useAuth } from '../hooks/useAuth';
import { deleteAccount, deleteDeviceId } from './../hooks/api';
import * as SecureStore from 'expo-secure-store';
import TermsModal from '../components/capstone/TermsModal'
import { updateProfile } from './../hooks/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [termsVisible, setTermsVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');  
  const [newEmail, setNewEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      RNAlert.alert(title, message);
    }
  };

  useEffect(() => {
    const fetchRole = async () => {
      const storedRole = await AsyncStorage.getItem('role');
      if (storedRole) setRole(storedRole);
    };
  
    fetchRole();
  }, []);

  const handleDeleteAccount = async () => {
    try {
      let deviceId: string | null = null;
  
      if (Platform.OS !== 'web') {
        deviceId = await SecureStore.getItemAsync('device_id');
      }
  
      const response = await deleteAccount(); // Deletes user from DB
  
      if (response?.message) {
        showAlert('Account Deleted', response.message);
  
        if (Platform.OS !== 'web' && deviceId) {
          try {
            await deleteDeviceId(); // API call
            await SecureStore.deleteItemAsync('device_id'); // Clean up storage
            console.log('Device lock removed');
          } catch (deviceErr) {
            console.error('Failed to delete device:', deviceErr);
          }
        }
  
        logout(); // Logs out after deletion
      } else {
        showAlert('Error', 'Unable to delete account.');
      }
    } catch (err: any) {
      showAlert('Error', err.message || 'Something went wrong.');
    }
  };
  
  const handleUpdateProfile = async () => {
    if (newPassword !== confirmPassword) {
      showAlert('Error', 'New passwords do not match.');
      return;
    }
  
    const { ok, data } = await updateProfile(newFirstName, newLastName, newEmail, oldPassword, newPassword);
  
    if (ok) {
      showAlert('Success', 'Profile updated successfully.');
      setEditModalVisible(false);
    } else {
      showAlert('Error', data.error || 'Failed to update profile.');
    }
  };

  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#1E3A8A" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.aboutContainer}>
        <Text style={styles.sectionTitle1}>About NOMark</Text>
        <Text style={styles.aboutText}>
          NOMark is a cross-platform attendance management system designed to make classroom check-ins seamless, fast, and secure.
        </Text>
        <Text style={styles.aboutText}>
          Built with students and teachers in mind, it uses QR codes and real-time tracking to streamline the process while maintaining accountability.
        </Text>
      </View>

      <View style={styles.creditsContainer}>
        <Text style={styles.sectionTitle1}>Credits</Text>
        <Text style={styles.creditTextCenter}>
          NOMark was developed by Noah, Owen, and Michael as part of a capstone project.
        </Text>
        <Text style={styles.creditTextCenter}>
          Built using React Native, Expo, Node.js, Blood, Sweat, and Tears.
        </Text>
      </View>

      <Text
        style={styles.termsLink}
        onPress={() => setTermsVisible(true)}
      >
        📄 View Terms and Conditions
      </Text>

      <TermsModal
        visible={termsVisible}
        onAccept={() => {
          setTermsVisible(false);
          showAlert('Accepted', 'Thank you for accepting the Terms and Conditions.');
        }}
        onDecline={() => {
          setTermsVisible(false);
          showAlert('Declined', 'You declined the Terms and Conditions.');
        }}
      />

      {role === 'teacher' && (
        <TouchableOpacity style={styles.editButton} onPress={() => setEditModalVisible(true)}>
          <Text style={styles.buttonText}>✏️ Edit Profile</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>🗑 Delete Account</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Type "delete" to confirm account deletion:</Text>
            <TextInput
              style={styles.input}
              value={confirmationText}
              onChangeText={setConfirmationText}
              autoCapitalize="none"
              placeholder="Type here"
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => {
                  if (confirmationText.toLowerCase() === 'delete') {
                    handleDeleteAccount();
                  } else {
                    showAlert('Incorrect Input', 'You must type "delete" to confirm.');
                  }
                }}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <TextInput
              style={styles.input}
              value={newFirstName}
              onChangeText={setNewFirstName}
              placeholder="New First Name"
            />
            <TextInput
              style={styles.input}
              value={newLastName}
              onChangeText={setNewLastName}
              placeholder="New Last Name"
            />
            <TextInput
              style={styles.input}
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="New Email"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              value={oldPassword}
              onChangeText={setOldPassword}
              placeholder="Current Password"
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="New Password"
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm New Password"
              secureTextEntry
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleUpdateProfile}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}
