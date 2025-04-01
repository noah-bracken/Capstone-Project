import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './components/styles';
import { createClass } from '../hooks/api';
import { useClassContext } from './context/ClassContext';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AddClassScreen() {
  const router = useRouter();
  const { refreshClasses } = useClassContext();
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#4C1D95');
  const [meetingTimes, setMeetingTimes] = useState([
    { day: 'Monday', hour: '00', minute: '00' },
  ]);

  const updateTime = (index: number, value: string, field: 'day' | 'hour' | 'minute') => {
    const updatedTimes = [...meetingTimes];
    updatedTimes[index][field] = value;
    setMeetingTimes(updatedTimes);
  };

  const addMeetingTime = () => {
    if (meetingTimes.length < 5) {
      setMeetingTimes([...meetingTimes, { day: 'Monday', hour: '00', minute: '00' }]);
    } else {
      Alert.alert('Limit Reached', 'You can only add up to 5 meeting times.');
    }
  };

  const removeMeetingTime = (index: number) => {
    const updated = meetingTimes.filter((_, i) => i !== index);
    setMeetingTimes(updated);
  };

  const handleCreateClass = async () => {
    if (!className.trim()) {
      Alert.alert('Error', 'Class name is required.');
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
        Alert.alert('Success', 'Class created!');
        await refreshClasses();
        router.replace('/');
      } else {
        Alert.alert('Error', 'Failed to create class.');
      }
    } catch (err: any) {
      console.error('Create class error:', err);
      Alert.alert('Error', err.message || 'Something went wrong.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
      {meetingTimes.map((time, index) => (
        <View key={index} style={styles.timeRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Day"
            value={time.day}
            onChangeText={(value) => updateTime(index, value, 'day')}
          />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={2}
            placeholder="HH"
            value={time.hour}
            onChangeText={(value) => updateTime(index, value, 'hour')}
          />
          <Text style={styles.colon}>:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={2}
            placeholder="MM"
            value={time.minute}
            onChangeText={(value) => updateTime(index, value, 'minute')}
          />
          <TouchableOpacity onPress={() => removeMeetingTime(index)}>
            <Text style={styles.buttonText}>🗑</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addClassButton} onPress={addMeetingTime}>
        <Text style={styles.buttonText}>+ Add Meeting Time</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addClassButton} onPress={handleCreateClass}>
        <Text style={styles.addClassText}>Create Class</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}