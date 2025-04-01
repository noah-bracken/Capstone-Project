import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import styles from '../../../components/styles';
import { deleteClass } from '../../../../hooks/api';
import { useClassContext } from '../../../context/ClassContext';
import ConfirmModal from '../../../components/confirm';

export default function ClassSettingsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { refreshClasses } = useClassContext();
  const [modalVisible, setModalVisible] = useState(false);

  const handleDeleteClass = async () => {
    setModalVisible(false);

    const classId = Array.isArray(id) ? id[0] : id; // keep it as string
    const response = await deleteClass(classId);    // no Number()

    if (response?.message) {
      console.log('Class deleted successfully, refreshing list...');
      refreshClasses();
      router.replace('/');
    } else {
      console.error('Failed to delete class:', response);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Class Settings</Text>

      <TouchableOpacity style={styles.homeButton} onPress={() => router.back()}>
        <Text style={styles.buttonText}>↩ Back to Class</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>🗑 Delete Class</Text>
      </TouchableOpacity>

      <ConfirmModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={handleDeleteClass}
      />
    </View>
  );
}
