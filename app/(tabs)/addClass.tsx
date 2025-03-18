import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import TimePicker from '../components/pickTime';
import ColorPicker from '../components/pickColor';
import styles from '../components/styles';
import { addClass } from '../../hooks/api';
import { useClassContext } from '../context/ClassContext'; // Import context

export default function AddClassScreen() {
  const router = useRouter();
  const { refreshClasses } = useClassContext(); // Get refresh function
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTimes, setSelectedTimes] = useState([{ hour: '00', minute: '00' }]);
  const [classColor, setClassColor] = useState('#3498db');

  const handleAddClass = async () => {
    if (className.trim() === '') {
      Alert.alert('Error', 'Class name cannot be empty!');
      return;
    }

    const teacher_id = 1; 

    try {
      const response = await addClass(className, description, selectedTimes, classColor,  teacher_id);

      if (response && response.message) {
        Alert.alert('Success', `Class "${className}" added!`);
        console.log('New Class:', response);

        //Refresh the class list
        refreshClasses();

        // Reset fields
        setClassName('');
        setDescription('');
        setSelectedTimes([{ hour: '00', minute: '00' }]);
        setClassColor('#3498db');

        // Navigate back
        router.push('/');
      } else {
        Alert.alert('Error', 'Failed to add class');
      }
    } catch (error) {
      console.error('Add class error:', error);
      Alert.alert('Error', 'Something went wrong!');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/')}>
        <Text style={styles.buttonText}>↩ Home Page</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Add a New Class</Text>

      {/* Class Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter class name"
        value={className}
        onChangeText={setClassName}
      />

      {/* Class Description Input */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter class description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* Meeting Time Picker */}
      <TimePicker selectedTimes={selectedTimes} setSelectedTimes={setSelectedTimes} />

      {/* Color Picker */}
      <ColorPicker selectedColor={classColor} setSelectedColor={setClassColor} />

      {/* Save Class Button */}
      <TouchableOpacity style={[styles.addClassButton, { backgroundColor: classColor }]} onPress={handleAddClass}>
        <Text style={styles.addClassText}>Save Class</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
