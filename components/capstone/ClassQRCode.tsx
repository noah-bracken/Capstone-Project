import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { v4 as uuidv4 } from 'uuid';
import styles from './styles';
import { storeSessionToken } from '../../hooks/api';

interface AttendanceQRCodeProps {
  classId: string | string[];
}

export default function AttendanceQRCode({ classId }: AttendanceQRCodeProps) {
  const [qrCodeValue, setQrCodeValue] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const generateQRCode = async () => {
    const token = uuidv4();
    const timestamp = Date.now();

    try {
      // Save session token to backend
      await storeSessionToken(classId.toString(), token, timestamp);

      // Create QR data
      const qrData = JSON.stringify({
        class_id: classId,
        session_token: token,
      });

      setQrCodeValue(qrData);
      setShowModal(true);
    } catch (error) {
      console.error('Failed to generate session token', error);
      Alert.alert('Error', 'Could not generate QR code.');
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={generateQRCode}
      >
        <Text style={styles.buttonText}>Generate Attendance QR</Text>
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="fade">
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'black',
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
