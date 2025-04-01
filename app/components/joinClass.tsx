import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { useClassContext } from '../context/ClassContext';
import styles from './styles';
import { joinClass } from '../../hooks/api';

type JoinModalProps = {
    visible: boolean;
    onCancel: () => void;
  };

export default function JoinModal({ visible, onCancel }: JoinModalProps) {
    const [classCode, setClassCode] = useState('');
    const { classes, refreshClasses } = useClassContext();
    const handleJoinClass = async () => {
        if (!classCode.trim()) {
          Alert.alert("Error", "Please enter a valid Class ID.");
          return;
        }
    
        try {
          const result = await joinClass(classCode);
          Alert.alert("Success", result.message || "Joined the class!");
          setClassCode('');
          refreshClasses();
        } catch (err: any) {
          Alert.alert("Error", err.message || "Could not join class.");
        }
      };
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
        <TextInput
            placeholder="Enter Class ID"
            value={classCode}
            onChangeText={setClassCode}
            style={styles.input}
            autoCapitalize="characters"
            maxLength={6}
        />
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleJoinClass}>
                <Text style={styles.buttonText}>Join Class</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
    </Modal>
  );
}