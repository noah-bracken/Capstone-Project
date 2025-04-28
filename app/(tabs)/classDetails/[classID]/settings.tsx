import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import styles from '../../../../components/capstone/styles';
import TimePickerModal from '../../../../components/capstone/TimePickerModal';
import { useClassContext } from '../../../../context/ClassContext';
import { fetchClassSettings, updateClass, deleteClass } from '../../../../hooks/api';
import ConfirmModal from '../../../../components/capstone/confirm';
import { ClassType } from '../../../../components/capstone/types'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function ClassSettingsScreen() {
  const router = useRouter();
  const { classID, preload } = useLocalSearchParams<{ classID: string; preload?: string }>();
  const { refreshClasses } = useClassContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#4C1D95');
  const [meetingTimes, setMeetingTimes] = useState<
    { day: string; hour: string; minute: string }[]
  >([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState<ClassType | null>(
    preload ? JSON.parse(preload) : null
  );
  
  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };  

  useEffect(() => {
    if (classData) {
      setClassName(classData.class_name || '');
      setDescription(classData.description || '');
      setColor(classData.color || '#4C1D95');
      setMeetingTimes(
        classData.meeting_times?.map((mt) => {
          const [hour, minute] = mt.time.split(':');
          return {
            day: mt.day,
            hour: hour.padStart(2, '0'),
            minute: minute.padStart(2, '0'),
          };
        }) || []
      );
    }
  }, [classData]);

  useEffect(() => {

    if (classData) {
      setLoading(false);
      return;
    }
  
    const fetchDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token || !classID) return;
    
        const data = await fetchClassSettings(classID);
        setClassData(data);
      } catch (e) {
        console.error('Error fetching settings:', e);
      } finally {
        setLoading(false);
      }
    };
    
  
    fetchDetails().catch((e) => console.error('Error fetching settings:', e));
  }, [classID]);
   
  
  const isAtLeastOneHourApart = (
      newDay: string,
      newHour: number,
      newMinute: number,
      existing: { day: string; hour: string; minute: string }[]
    ) => {
      const newTime = newHour * 60 + newMinute;
    
      return !existing.some(({ day, hour, minute }) => {
        if (day !== newDay) return false;
    
        const existingTime = parseInt(hour) * 60 + parseInt(minute);
        const diff = Math.abs(existingTime - newTime);
    
        return diff < 60;
      });
    };  

    const removeMeetingTime = (index: number) => {
      setMeetingTimes((prev) => prev.filter((_, i) => i !== index));
    };
    
  const handleAddMeetingTime = (day: string, hour: number, minute: number) => {
    const formattedHour = hour.toString().padStart(2, '0');
    const formattedMinute = minute.toString().padStart(2, '0');
  
    if (meetingTimes.length >= 5) {
      showAlert('Limit Reached', 'You can only add up to 5 meeting times.');
      return;
    }
  
    const duplicate = meetingTimes.some(
      (t) => t.day === day && t.hour === formattedHour && t.minute === formattedMinute
    );
  
    if (duplicate) {
      showAlert('Duplicate', 'This meeting time already exists.');
      return;
    }
  
    if (!isAtLeastOneHourApart(day, hour, minute, meetingTimes)) {
      showAlert('Too Close', 'Meeting times must be at least 1 hour apart.');
      return;
    }
  
    setMeetingTimes([...meetingTimes, { day, hour: formattedHour, minute: formattedMinute }]);
  };

  

  const handleSave = async () => {
    if (!className.trim()) {
      showAlert('Error', 'Class name is required.');
      return;
    }

    try {
      const result = await updateClass(classID as string, className, description, color, meetingTimes);
      if (result?.message) {
        showAlert('Success', 'Class updated successfully.');
        await refreshClasses();
        router.replace(`/(tabs)/classDetails/${classID}`);
      } else {
        showAlert('Error', 'Failed to update class.');
      }
    } catch (err: any) {
      showAlert('Error', err.message || 'Something went wrong.');
    }
  };

  const handleDeleteClass = async () => {
    setModalVisible(false);

    const classId = Array.isArray(classID) ? classID[0] : classID;
    const response = await deleteClass(classId);

    if (response?.message) {
      console.log('Class deleted successfully, refreshing list...');
      refreshClasses();
      router.replace('/');
    } else {
      console.error('Failed to delete class:', response);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1E3A8A" />
        <Text style={styles.title}>Loading Class Settings...</Text>
      </View>

    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push({
        pathname: '/(tabs)/classDetails/[id]',
        params: { id: classID },
      })}>
        <Ionicons name="arrow-back" size={24} color="#1E3A8A" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.responsiveWrapper}>
      

      <Text style={[styles.title, { marginBottom: 16 }]}>Class Settings</Text>

      <TextInput
        style={styles.input}
        placeholder="Class Name"
        value={className}
        onChangeText={setClassName}
      />

      <TextInput
        style={[styles.input, styles.textArea, { marginTop: 12 }]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.sectionTitle}>Meeting Times</Text>
      {meetingTimes.length > 0 && (
        <View style={{ marginBottom: 12 }}>
          {meetingTimes.map((time, index) => {
            const hourNum = parseInt(time.hour);
            const minute = time.minute || '00';
            const ampm = hourNum >= 12 ? 'PM' : 'AM';
            const displayHour = hourNum % 12 === 0 ? 12 : hourNum % 12;

            return (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <Text style={[styles.text, { flex: 0.12 }]}>
                  {`${time.day} - ${displayHour}:${minute} ${ampm}`}
                </Text>
                <TouchableOpacity onPress={() => removeMeetingTime(index)} style={{ marginLeft: 8 }}>
                  <Ionicons name="trash-outline" size={20} color="#DC2626" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}

      <TouchableOpacity style={styles.addClassButton} onPress={() => setShowModal(true)}>
        <Text style={styles.buttonText}>+ Add Meeting Time</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addClassButton} onPress={handleSave}>
        <Text style={styles.addClassText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.deleteButton, { width: '100%', maxWidth: '100%' }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>🗑 Delete Class</Text>
      </TouchableOpacity>



      <ConfirmModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={handleDeleteClass}
      />

      <TimePickerModal
        visible={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={(day, hour, minute) => {
          handleAddMeetingTime(day, hour, minute);
          setShowModal(false);
        }}
      />
      </View>
    </ScrollView>
  );
}
