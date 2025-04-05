import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Platform,
  Pressable,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
} from 'expo-camera';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { validateSessionToken } from '../../hooks/api';

export default function ScanQRCodeScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setScanned(false);
      setScanMessage(null);
      setLoading(false);
    }, [])
  );

  const handleBarcodeScanned = async (scanningResult: BarcodeScanningResult) => {
    if (scanned || loading) return;
    const { data } = scanningResult;
    setScanned(true);
    setLoading(true);

    try {
      const parsed = JSON.parse(data);
      const { class_id, session_token } = parsed;

      const isValid = await validateSessionToken(class_id, session_token);
      if (isValid) {
        const time = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        setScanMessage(`Attendance marked at ${time}`);
      } else {
        setScanMessage('Invalid or expired QR code');
      }
    } catch (err) {
      console.error('Scan failed:', err);
      setScanMessage('Error: Invalid QR code format');
    } finally {
      setLoading(false);
    }
  };

  if (Platform.OS !== 'android') {
    return (
      <Pressable style={styles.center} onPress={() => router.back()}>
        <Text>QR scanning is only available on Android devices.</Text>
        <Text style={styles.hint}>(Tap anywhere to go back)</Text>
      </Pressable>
    );
  }

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1 }}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={handleBarcodeScanned}
      />

      {/* Overlay frame */}
      <Image
        source={require('./qrimage.png')}
        style={styles.overlay}
        resizeMode="contain"
      />

      {/* Toast */}
      {scanMessage && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{scanMessage}</Text>
        </View>
      )}

      {/* Loading Spinner */}
      {loading && (
        <ActivityIndicator
          size="large"
          color="#4C1D95"
          style={{ position: 'absolute', top: '10%', alignSelf: 'center' }}
        />
      )}

      {/* Tap anywhere to go back */}
      <Pressable style={StyleSheet.absoluteFillObject} onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  hint: {
    marginTop: 10,
    fontSize: 14,
    color: '#888',
  },
  overlay: {
    position: 'absolute',
    top: '30%',
    left: '15%',
    width: '70%',
    height: '40%',
    zIndex: 10,
    opacity: 0.9,
  },
  toast: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    zIndex: 100,
  },
  toastText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
