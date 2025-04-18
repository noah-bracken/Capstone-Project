import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import styles from '../../../../components/capstone/styles';
import TimePickerModal from '../../../../components/capstone/TimePickerModal';
import { useClassContext } from '../../../../context/ClassContext';
import { fetchClassSettings, updateClass, deleteClass } from '../../../../hooks/api';
import ConfirmModal from '../../../../components/capstone/confirm';

export default function ClassSettingsScreen() {
  const router = useRouter();
  const { classID } = useLocalSearchParams<{ classID: string }>();
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

  useEffect(() => {
    const fetchDetails = async () => {
      if (!classID) {
        return;
      }
  
      console.log('Fetching class settings...');
      const data = await fetchClassSettings(classID);
      console.log('Fetch returned:', data);
  
      if (!data) {
        return;
      }
  
      setClassName(data.class_name || '');
      setDescription(data.description || '');
      setColor(data.color || '#4C1D95');
  
      if (Array.isArray(data.meeting_times)) {
        const cleaned = data.meeting_times.map((t: any) => {
          const [h, m] = (t.time || '00:00').split(':');
          return {
            day: t.day || 'Monday',
            hour: h?.padStart(2, '0') || '00',
            minute: m?.padStart(2, '0') || '00',
          };
        });
        setMeetingTimes(cleaned);
      }
      setLoading(false);
    };
  
    fetchDetails().catch((e) => console.log('Unhandled fetchDetails error:', e));
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
      Alert.alert('Limit Reached', 'You can only add up to 5 meeting times.');
      return;
    }
  
    const duplicate = meetingTimes.some(
      (t) => t.day === day && t.hour === formattedHour && t.minute === formattedMinute
    );
  
    if (duplicate) {
      Alert.alert('Duplicate', 'This meeting time already exists.');
      return;
    }
  
    if (!isAtLeastOneHourApart(day, hour, minute, meetingTimes)) {
      Alert.alert('Too Close', 'Meeting times must be at least 1 hour apart.');
      return;
    }
  
    setMeetingTimes([...meetingTimes, { day, hour: formattedHour, minute: formattedMinute }]);
  };

  

  const handleSave = async () => {
    if (!className.trim()) {
      Alert.alert('Error', 'Class name is required.');
      return;
    }

    try {
      const result = await updateClass(classID as string, className, description, color, meetingTimes);
      if (result?.message) {
        Alert.alert('Success', 'Class updated successfully.');
        await refreshClasses();
        router.replace(`/(tabs)/classDetails/${classID}`);
      } else {
        Alert.alert('Error', 'Failed to update class.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Something went wrong.');
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
        <Text style={styles.title}>Loading Class Settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.homeButton} onPress={() => router.back()}>
        <Text style={styles.buttonText}>↩ Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Class Settings</Text>

      <TextInput
        style={styles.input}
        placeholder="Class Name"
        value={className}
        onChangeText={setClassName}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
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
              <View key={index} style={styles.timeRow}>
                <Text style={[styles.text, { flex: 1 }]}>
                  {`${time.day} - ${displayHour}:${minute} ${ampm}`}
                </Text>
                <TouchableOpacity onPress={() => removeMeetingTime(index)}>
                  <Text style={styles.buttonText}>🗑</Text>
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

      <TouchableOpacity style={styles.deleteButton} onPress={() => setModalVisible(true)}>
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
    </ScrollView>
  );
}
