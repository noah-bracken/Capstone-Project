import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import styles from './styles';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function TimeSettings() {
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

  const saveTimes = () => {
    console.log('Saved meeting times:', meetingTimes);
    Alert.alert('Saved', 'Meeting times saved!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Set Meeting Times</Text>

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
        <Text style={styles.buttonText}>+ Add Time</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={saveTimes}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
