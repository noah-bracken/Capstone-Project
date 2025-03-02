import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';

const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6']; // Default colors

export default function ColorPicker({ selectedColor, setSelectedColor }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Select Class Color</Text>
      <View style={styles.colorContainer}>
        {colors.map((color) => (
          <TouchableOpacity
            key={color}
            style={[styles.colorBox, { backgroundColor: color, borderWidth: selectedColor === color ? 2 : 0 }]}
            onPress={() => setSelectedColor(color)}
          />
        ))}
      </View>
    </View>
  );
}
