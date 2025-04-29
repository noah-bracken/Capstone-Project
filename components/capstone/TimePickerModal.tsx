import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const hours = [...Array(12).keys()].map(i => i + 1);
const minutes = [...Array(12).keys()].map(i => (i * 5).toString().padStart(2, '0'));
const ampm = ['AM', 'PM'];

interface TimePickerModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (day: string, hour: number, minute: number) => void;
}

export default function TimePickerModal({ visible, onCancel, onConfirm }: TimePickerModalProps) {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedHour, setSelectedHour] = useState(1);
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');

  const handleConfirm = () => {
    let hour = selectedHour % 12;
    if (selectedPeriod === 'PM') hour += 12;
    onConfirm(selectedDay, hour, parseInt(selectedMinute));
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Select Meeting Time</Text>

          <View style={styles.selectorRow}>
            <ScrollView style={styles.picker}>
              {days.map(day => (
                <TouchableOpacity key={day} onPress={() => setSelectedDay(day)}>
                  <Text style={[styles.option, selectedDay === day && styles.selected]}>{day}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <ScrollView style={styles.picker}>
              {hours.map(h => (
                <TouchableOpacity key={h} onPress={() => setSelectedHour(h)}>
                  <Text style={[styles.option, selectedHour === h && styles.selected]}>{h}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <ScrollView style={styles.picker}>
              {minutes.map(m => (
                <TouchableOpacity key={m} onPress={() => setSelectedMinute(m)}>
                  <Text style={[styles.option, selectedMinute === m && styles.selected]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <ScrollView style={styles.picker}>
              {ampm.map(p => (
                <TouchableOpacity key={p} onPress={() => setSelectedPeriod(p as 'AM' | 'PM')}>
                  <Text style={[styles.option, selectedPeriod === p && styles.selected]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.buttonCancel} onPress={onCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonConfirm} onPress={handleConfirm}>
                <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      width: Platform.select({
        android: '95%',
        web: '50%',
        default: '50%',
      }),
      height: 380,
      backgroundColor: 'white',
      borderRadius: 20,
      paddingVertical: 20,
      paddingHorizontal: 10,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
        },
        android: {
          elevation: 6,
        },
        web: {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        },
      }),
    },    
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 15,
      color: '#1E293B',
    },
    selectorRow: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      height: 220,
      marginBottom: 10,
    },
    picker: {
      width: 70,
    },
    option: {
      fontSize: 18,
      paddingVertical: 8,
      textAlign: 'center',
      color: '#334155',
    },
    selected: {
      backgroundColor: '#C7D2FE',
      borderRadius: 10,
      color: '#1E3A8A',
      fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 20,
      },
      
      buttonCancel: {
        backgroundColor: '#F87171',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 12,
        minWidth: 120,
        alignItems: 'center',
      },
      
      buttonConfirm: {
        backgroundColor: '#34D399',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 12,
        minWidth: 120,
        alignItems: 'center',
      },
      
      buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
      },
      
  });
  