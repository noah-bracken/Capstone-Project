import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import TimePicker from '../components/pickTime';
import ColorPicker from '../components/pickColor';
import styles from '../components/styles';

export default function AddClassScreen() {
  const router = useRouter();
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTimes, setSelectedTimes] = useState([{ hour: '00', minute: '00' }]);
  const [classColor, setClassColor] = useState('#3498db'); // Default blue color

  const handleAddClass = () => {
    if (className.trim() === '') {
      Alert.alert('Error', 'Class name cannot be empty!');
      return;
    }

    const newClass = {
      name: className,
      description,
      meetingTimes: selectedTimes,
      color: classColor,
    };

    // Here you can save the class to a database or state
    Alert.alert('Success', `Class "${className}" added!`);
    console.log('New Class:', newClass);

    // Reset fields
    setClassName('');
    setDescription('');
    setSelectedTimes([{ hour: '00', minute: '00' }]);
    setClassColor('#3498db');

    // Navigate back
    router.push('/');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add a New Class</Text>
      
      {/* Header */}
      <Text style={styles.title}>NOMark</Text>
        <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/')}>
          <Text style={styles.buttonText}>↩ Home Page</Text>
        </TouchableOpacity>
    
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
