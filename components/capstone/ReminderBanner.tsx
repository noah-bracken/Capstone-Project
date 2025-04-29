import React from 'react';
import {
  View,
  Text,
  Pressable,
  Platform,
  StyleSheet,
  Modal,
} from 'react-native';

export default function ReminderBanner({
  className,
  onPress,
  onDismiss,
}: {
  className: string;
  onPress: () => void;
  onDismiss?: () => void;
}) {
  if (Platform.OS === 'web') {
    return (
      <Pressable style={styles.webContainer} onPress={onPress}>
        <Text style={styles.text}>
          {className} starts soon — click to go!
        </Text>
      </Pressable>
    );
  }

  return (
    <Modal animationType="fade" transparent visible>
      {/* Clicking outside dismisses */}
      <Pressable style={styles.overlay} onPress={onDismiss}>
        {/* Stop propagation so tap inside doesn't trigger dismissal */}
        <Pressable style={styles.modalBox} onPress={onPress}>
          <Text style={styles.text}>
            {className} starts soon — tap to go!
          </Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    backgroundColor: '#3B82F6',
    padding: 14,
    borderRadius: 12,
    zIndex: 1000,
    boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#3B82F6',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
