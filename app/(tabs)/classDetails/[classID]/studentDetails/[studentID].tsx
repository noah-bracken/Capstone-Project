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

const API_URL = 'https://capstone-db-lb2e.onrender.com';

type SessionData = {
  qr_id: number;
  generated_at: string;
  class_name: string;
  status: 'present' | 'late' | 'absent';
  scanned_at?: string;
};


export default function StudentDetails() {
  const { classID, studentID } = useLocalSearchParams();
  const class_id = typeof classID === 'string' ? classID : Array.isArray(classID) ? classID[0] : '';
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const router = useRouter();
  const [dateSelected, setDateSelected] = useState(false);

  const fetchRecentAttendance = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/students/${studentID}/attendance/recent?class_id=${classID}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSessions(data);
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
  
    const res = await fetch(`${API_URL}/students/${studentID}/attendance/by-date/${formatted}?class_id=${classID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    const data = await res.json();
      if (Array.isArray(data)) {
        setSessions(data);
      } else {
        console.error('Invalid session data:', data);
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
      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          router.push({
            pathname: '/(tabs)/classDetails/[id]',
            params: { id: class_id },
          })
        }
      >
        <Text style={styles.backText}>↩ Back</Text>
      </TouchableOpacity>
      <View style={styles.responsiveWrapper}>
      <Text style={styles.title}>Student Details</Text>
      <Text style={styles.text}>Name: {student.first_name} {student.last_name}</Text>
      <Text style={styles.text}>Email: {student.email}</Text>

      

      {!dateSelected && (
        <Text style={styles.subtitle}>Recent Attendance</Text>
      )}

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
      <View style={{ alignItems: 'center', marginVertical: 12 }}>
        <TouchableOpacity onPress={() => setShowPicker((prev) => !prev)}>
          <Text style={{ color: '#7C3AED', fontSize: 16, fontWeight: '500' }}>
            📅 Select Date: {selectedDate.toDateString()}
          </Text>
        </TouchableOpacity>
      </View>
      {showPicker && (
        <View style={{ alignItems: 'center', marginVertical: 10 }}>
          {Platform.OS === 'web' ? (
            <View style={{ maxWidth: 320 }}>
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
            </View>
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
                  fetchAttendanceByDate(date);
                }
              }}
            />
          )}
        </View>
      )}
      {dateSelected && (
        <View style={{ alignItems: 'center', marginVertical: 12 }}>
        <TouchableOpacity
          onPress={() => {
            setDateSelected(false);
            fetchRecentAttendance();
          }}
        >
          <Text style={{ color: '#7C3AED', fontSize: 16, fontWeight: '500' }}>
            🔄 Show Recent Attendance
          </Text>
        </TouchableOpacity>
      </View>      
      )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  responsiveWrapper: {
    width: '100%',
    alignSelf: 'center',
    ...(Platform.OS === 'web' && {
      maxWidth: '60%',
    }),
  },
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
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  statusButton: {
    padding: 6,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    borderRadius: 4,
    marginLeft: 4,
  },
  activeStatus: {
    backgroundColor: '#93C5FD',
    borderColor: '#3B82F6',
  },
  statusText: {
    fontWeight: 'bold',
    color: '#1E3A8A',
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
    color: '#4C1D95',
    fontWeight: '500',
  },
  
});
