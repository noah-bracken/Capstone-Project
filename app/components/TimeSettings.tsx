import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity,} from 'react-native';
import styles from '../components/styles';

export default function TimeSettings() {
  const [meetingTimes, setMeetingTimes] = useState([
    { hour: '00', minute: '00' },
    { hour: '00', minute: '00' }
  ]);

  const updateTime = (index: number, value: string, type: 'hour' | 'minute') => {
    const updatedTimes = [...meetingTimes];
    updatedTimes[index][type] = value;
    setMeetingTimes(updatedTimes);
  };

  const saveTimes = () => {
    console.log('Updated meeting times:', meetingTimes);
    alert('Meeting times saved!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Meeting Times</Text>
      
      {meetingTimes.map((time, index) => (
        <View key={index} style={styles.timeRow}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={2}
            value={time.hour}
            onChangeText={(value) => updateTime(index, value, 'hour')}
          />
          <Text style={styles.colon}>:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={2}
            value={time.minute}
            onChangeText={(value) => updateTime(index, value, 'minute')}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.saveButton} onPress={saveTimes}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}
