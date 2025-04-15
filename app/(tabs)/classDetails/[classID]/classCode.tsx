import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import styles from '../../../../components/capstone/styles';

type ClassCodeModalProps = {
  visible: boolean;
  onClose: () => void;
  classCode: string;
};

export default function ClassCodeModal({ visible, onClose, classCode }: ClassCodeModalProps) {
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={{ transform: [{ scale: 2 }] }}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Class Code</Text>
            <Text style={styles.modalcodeText}>Share this code with students:</Text>
            {classCode ? (
              <Text style={styles.classCode}>{classCode}</Text>
            ) : null}

            <TouchableOpacity style={styles.confirmButton} onPress={onClose}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
