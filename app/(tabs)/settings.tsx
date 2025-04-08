import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { router, useRouter } from 'expo-router';
import styles from '../components/styles'; // Import global styles

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings page</Text>

      {/* Header */}
      <Text style={styles.title}>NOMark</Text>
        <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/')}>
          <Text style={styles.buttonText}>↩ Home Page</Text>
        </TouchableOpacity>

      {/* Save Button */}
      <TouchableOpacity style={styles.addClassButton} onPress={() => alert('Settings Saved!')}>
        <Text style={styles.addClassText}>Save Settings</Text>
      </TouchableOpacity>
    </View>
  );
}
