import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AttendanceQRCodeProps {
  classId: string | string[];
}

export default function AttendanceQRCode({ classId }: AttendanceQRCodeProps) {
  const [qrCodeValue, setQrCodeValue] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const showQRCode = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const class_id = typeof classId === 'string' ? classId : classId[0];

      const res = await fetch(`https://capstone-db-lb2e.onrender.com/classes/${class_id}/latest-session`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch session (${res.status})`);
      }

      const data = await res.json();

      if (!data || !data.session_token) {
        Alert.alert('No Active QR', 'There is no attendance session available right now.');
        return;
      }

      const qrData = JSON.stringify({
        class_id,
        session_token: data.session_token,
      });

      setQrCodeValue(qrData);
      setShowModal(true);
    } catch (error) {
      console.error('Failed to fetch QR session:', error);
      Alert.alert('Error', 'Could not load QR code.');
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.homeButton} onPress={showQRCode}>
        <Text style={styles.buttonText}>Show Attendance QR</Text>
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="fade">
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.8)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setShowModal(false)}
        >
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 16,
              alignItems: 'center',
            }}
          >
            {qrCodeValue && <QRCode value={qrCodeValue} size={400} />}
            <Text style={{ marginTop: 10, color: '#64748B' }}>(Tap anywhere to close)</Text>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
