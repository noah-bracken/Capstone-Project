import React from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';

export default function ReminderBanner({ className, onPress }: { className: string, onPress: () => void }) {
  return (
    <Pressable style={Platform.OS === 'web' ? styles.web : styles.android} onPress={onPress}>
      <Text style={styles.text}>
        {className} starts soon — {Platform.OS === 'web' ? 'click to go' : 'tap to open'}!
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  web: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    backgroundColor: '#3B82F6',
    padding: 14,
    borderRadius: 12,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  android: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
