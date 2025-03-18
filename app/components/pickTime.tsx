import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from './styles';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function TimePicker({ selectedTimes, setSelectedTimes }) {
  const updateTime = (index, value, type) => {
    const updatedTimes = [...selectedTimes];
    updatedTimes[index][type] = value;
    setSelectedTimes(updatedTimes);
  };

  const addMeetingTime = () => {
    if (selectedTimes.length >= 10) {
      Alert.alert('Limit Reached', 'You cannot add more than 10 meeting times per week.');
      return;
    }
    setSelectedTimes([...selectedTimes, { day: 'Monday', hour: '00', minute: '00' }]);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Select Meeting Times</Text>

      {selectedTimes.map((time, index) => (
        <View key={index} style={styles.timeRow}>
          {/* Day Selector */}
          <Picker
            selectedValue={time.day}
            style={styles.picker}
            onValueChange={(value) => updateTime(index, value, 'day')}
          >
            {daysOfWeek.map((day) => (
              <Picker.Item key={day} label={day} value={day} />
            ))}
          </Picker>

          {/* Time Input (Hour) */}
          <TextInput
            style={styles.timeInput}
            keyboardType="numeric"
            maxLength={2}
            value={time.hour}
            onChangeText={(value) => updateTime(index, value, 'hour')}
          />
          <Text style={styles.colon}>:</Text>

          {/* Time Input (Minute) */}
          <TextInput
            style={styles.timeInput}
            keyboardType="numeric"
            maxLength={2}
            value={time.minute}
            onChangeText={(value) => updateTime(index, value, 'minute')}
          />
        </View>
      ))}

      {/* Add Meeting Time Button */}
      <TouchableOpacity style={styles.saveButton} onPress={addMeetingTime}>
        <Text style={styles.addButtonText}>+ Add Another Time</Text>
      </TouchableOpacity>
    </View>
  );
}
