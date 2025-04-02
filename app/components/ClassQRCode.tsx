import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { v4 as uuidv4 } from 'uuid';
import styles from './styles';

interface AttendanceQRCodeProps {
  classId: string | string[];
}

export default function AttendanceQRCode({ classId }: AttendanceQRCodeProps) {
  const [qrCodeValue, setQrCodeValue] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const generateQRCode = () => {
    const uniqueId = uuidv4();
    const qrData = JSON.stringify({
      class_id: classId,
      code: uniqueId,
      timestamp: Date.now(),
    });
    setQrCodeValue(qrData);
    setShowModal(true);
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.homeButton, { marginBottom: 10 }]}
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
