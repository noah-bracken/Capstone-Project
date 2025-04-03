import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './components/styles';
import { createClass } from '../hooks/api';
import { useClassContext } from './context/ClassContext';
import TimePickerModal from './components/TimePickerModal';

// Cross-platform alert
const showAlert = (title: string, message: string) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

export default function AddClassScreen() {
  const router = useRouter();
  const { refreshClasses } = useClassContext();
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#4C1D95');
  const [meetingTimes, setMeetingTimes] = useState<
    { day: string; hour: string; minute: string }[]
  >([]);
  const [showModal, setShowModal] = useState(false);

  const addMeetingTime = (day: string, hour: number, minute: number) => {
    const formattedHour = hour.toString().padStart(2, '0');
    const formattedMinute = minute.toString().padStart(2, '0');

    if (meetingTimes.length >= 5) {
      console.log('Meeting limit reached');
      showAlert('Limit Reached', 'You can only add up to 5 meeting times.');
      return;
    }

    const exists = meetingTimes.some(
      (t) => t.day === day && t.hour === formattedHour && t.minute === formattedMinute
    );

    if (exists) {
      console.log('Duplicate meeting time');
      showAlert('Duplicate Time', 'This meeting time already exists.');
      return;
    }

    setMeetingTimes(prev => [
      ...prev,
      { day, hour: formattedHour, minute: formattedMinute },
    ]);
  };

  const removeMeetingTime = (index: number) => {
    setMeetingTimes(meetingTimes.filter((_, i) => i !== index));
  };

  const isValidTime = (t: { hour: string, minute: string }) =>
    !isNaN(Number(t.hour)) &&
    !isNaN(Number(t.minute)) &&
    t.hour !== '' &&
    t.minute !== '';
  
  const invalidTime = meetingTimes.some(t => !isValidTime(t));
  if (invalidTime) {
    showAlert('Error', 'Please make sure all meeting times are valid.');
    return;
  }

  const handleCreateClass = async () => {
    if (!className.trim()) {
      showAlert('Error', 'Class name is required.');
      return;
    }
    if (meetingTimes.length === 0) {
      showAlert('Error', 'At least one meeting time is required.');
      return;
    }

    try {
      const payload = {
        class_name: className,
        description,
        color,
        meeting_times: meetingTimes,
      };

      const result = await createClass(payload);
      if (result?.message) {
        showAlert('Success', 'Class created!');
        await refreshClasses();
        router.replace('/');
      } else {
        showAlert('Error', 'Failed to create class.');
      }
    } catch (err: any) {
      console.error('Create class error:', err);
      showAlert('Error', err.message || 'Something went wrong.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/')}>
        <Text style={styles.buttonText}>↩ Home Page</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Add New Class</Text>

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
          {meetingTimes.map((time, index) => (
            <View key={index} style={styles.timeRow}>
              <Text style={[styles.text, { flex: 1 }]}>
                {(() => {
                  const hour = parseInt(time.hour);
                  const ampm = hour >= 12 ? 'PM' : 'AM';
                  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
                  return `${time.day} - ${displayHour}:${time.minute} ${ampm}`;
                })()}
              </Text>
              <TouchableOpacity onPress={() => removeMeetingTime(index)}>
                <Text style={styles.buttonText}>🗑</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.addClassButton} onPress={() => setShowModal(true)}>
        <Text style={styles.buttonText}>+ Add Meeting Time</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addClassButton} onPress={handleCreateClass}>
        <Text style={styles.addClassText}>Create Class</Text>
      </TouchableOpacity>

      <TimePickerModal
        visible={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={(day, hour, minute) => {
          addMeetingTime(day, hour, minute);
          setShowModal(false);
        }}
      />
    </ScrollView>
  );
}
