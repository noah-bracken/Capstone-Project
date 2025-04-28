import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'https://capstone-db-lb2e.onrender.com';

type SessionData = {
  qr_id: number;
  generated_at: string;
  class_name: string;
  status: 'present' | 'late' | 'absent';
  scanned_at?: string;
};

export default function AttendanceHistory() {
  const { classID, studentID } = useLocalSearchParams();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [dateSelected, setDateSelected] = useState(false);
  const router = useRouter();
  const [studentAttendanceRate, setStudentAttendanceRate] = useState<number | null>(null);

  

  const fetchRecentAttendance = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/students/${studentID}/attendance/recent?class_id=${classID}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setSessions(data);
      else setSessions([]);
    } catch (err) {
      console.error('Error fetching recent attendance:', err);
    }
  };

  useEffect(() => {
    const fetchStudent = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const res = await fetch(`${API_URL}/students/${studentID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStudent(data);
      } catch (err) {
        console.error('Error fetching student:', err);
      } finally {
        setLoading(false);
      }
    };

    if (studentID) {
      fetchStudent();
      fetchRecentAttendance();
    }
  }, [studentID]);


  const fetchAttendanceByDate = async (date: Date) => {
    const token = await AsyncStorage.getItem('token');
    const formatted = date.toISOString().split('T')[0];
    try {
      const res = await fetch(`${API_URL}/students/${studentID}/attendance/by-date/${formatted}?class_id=${classID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setSessions(data);
      } else {
        setSessions([]);
      }
    } catch (err) {
      console.error('Error fetching by date:', err);
      setSessions([]);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.container}>
        <Text>Student not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Attendance History</Text>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#1E3A8A" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>


      {!dateSelected && <Text style={styles.subtitle}>Recent Attendance</Text>}

      {loadingSessions && <ActivityIndicator size="small" color="#1E3A8A" />}

      {sessions.map((session) => (
        <View key={session.qr_id} style={styles.sessionItem}>
          <Text>{session.class_name}</Text>
          <Text>Scheduled: {
            new Date(new Date(session.generated_at).getTime() + 4 * 60 * 60 * 1000).toLocaleString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          }</Text>

          {session.scanned_at && (
            <Text>Updated: {
              new Date(new Date(session.scanned_at).getTime()).toLocaleString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            }</Text>
          )}
          <Text>Status: {session.status.toUpperCase()}</Text>
        </View>
      ))}
      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateButton}>
        <Text style={styles.buttonText}>📅 Select Date: {selectedDate.toDateString()}</Text>
      </TouchableOpacity>

      {showPicker && (
        Platform.OS === 'web' ? (
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setDateSelected(true);
              setSelectedDate(date as Date);
              setShowPicker(false);
              fetchAttendanceByDate(date as Date);
            }}            
            inline
          />
        ) : (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(e, date) => {
              setShowPicker(false);
              if (date) {
                setDateSelected(true);
                setSelectedDate(date);
                setShowPicker(false);
                fetchAttendanceByDate(date);
              }
            }}
          />
        )
      )}

      {dateSelected && (
        <TouchableOpacity
          onPress={() => {
            setDateSelected(false);
            fetchRecentAttendance();
          }}
          style={styles.dateButton}
        >
          <Text style={styles.buttonText}>🔄 Show Recent Attendance</Text>
        </TouchableOpacity>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 20,
    fontWeight: '600',
  },
  dateButton: {
    backgroundColor: '#2563EB',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  sessionItem: {
    padding: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    marginVertical: 4,
  },
  homeButton: {
    backgroundColor: '#4C1D95',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#334155',
    padding: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  backText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#1E3A8A',
    fontWeight: '500',
  }
  
});
