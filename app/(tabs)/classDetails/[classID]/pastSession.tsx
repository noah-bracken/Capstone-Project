import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AttendanceGauge from '../../../../components/capstone/AttendanceGauge';
import { useLocalSearchParams, useRouter } from 'expo-router';

const API_URL = 'https://capstone-db-lb2e.onrender.com';

type SessionInfo = {
  qr_id: number;
  generated_at: string;
  class_id: string;
  class_name: string;
};

type AttendanceEntry = {
attendance_id: number;
student_id: number;
first_name: string;
last_name: string;
status: 'present' | 'late' | 'absent';
timestamp?: string;
};
      
export default function PastSessionViewer() {
  const { classID } = useLocalSearchParams();
  const class_id = typeof classID === 'string' ? classID : Array.isArray(classID) ? classID[0] : '';
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [selectedSession, setSelectedSession] = useState<SessionInfo | null>(null);
  const [attendance, setAttendance] = useState<AttendanceEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [className, setClassName] = useState<string>('');
  type ExtendedSessionInfo = SessionInfo & { generated_local: Date };
  const [allSessions, setAllSessions] = useState<ExtendedSessionInfo[]>([]);
  const [dateSelected, setDateSelected] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token || !class_id) return;
  
      try {
        const res = await fetch(`${API_URL}/classes/${class_id}/sessions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const classRes = await fetch(`${API_URL}/classes/${class_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const classData = await classRes.json();
        setClassName(classData.class_name);
  
        const sessionArray = await res.json();
        const adjustedSessions = sessionArray.map((s: SessionInfo) => ({
          ...s,
          class_name: classData.class_name,
          generated_local: new Date(new Date(s.generated_at).getTime() + 4 * 60 * 60 * 1000),
        }));
  
        setAllSessions(adjustedSessions);
        setSessions(adjustedSessions.slice(0, 10));
      } catch (err) {
        console.error('Error fetching sessions:', err);
      }
    };
  
    fetchSessions();
  }, [class_id]);

  const fetchSessionsForDate = (selectedDate: Date) => {
    const filtered = allSessions.filter((s: ExtendedSessionInfo) =>
      s.generated_local.toDateString() === selectedDate.toDateString()
    );
    setSessions(filtered);
  };  
  
  const loadAttendance = async (session: SessionInfo) => {
    setSelectedSession(session);
    setLoading(true);
  
    try {
      const token = await AsyncStorage.getItem('token');
  
      const response = await fetch(`${API_URL}/sessions/${session.qr_id}/attendance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        console.error('Failed to fetch attendance:', response.status, await response.text());
        setLoading(false);
        return;
      }
  
      const data = await response.json();
      setAttendance(data);
    } catch (err) {
      console.error('Error loading attendance:', err);
    } finally {
      setLoading(false);
    }
  };  

  const updateAttendance = async (student_id: number, newStatus: 'present' | 'late' | 'absent') => {
    if (!selectedSession) return;
  
    const token = await AsyncStorage.getItem('token');
  
    await fetch(`${API_URL}/attendance/manual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        class_id: selectedSession.class_id,
        qr_id: selectedSession.qr_id,
        student_id,
        status: newStatus,
      }),
    });
  
    loadAttendance(selectedSession);
  };

  const computeAttendancePercent = () => {
    if (!attendance.length) return 0;
    const present = attendance.filter((a) => a.status === 'present' || a.status === 'late').length;
    return Math.round((present / attendance.length) * 100);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push({
        pathname: '/(tabs)/classDetails/[id]',
        params: { id: class_id },
      })}>
        <Ionicons name="arrow-back" size={24} color="#1E3A8A" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.responsiveWrapper}>
      <Text style={styles.title}>Past Sessions for {className}</Text>

      

      {loading && <ActivityIndicator size="large" color="#1E3A8A" />}

      {!loading && sessions.length > 0 && (
      <View>
          {!dateSelected && (
            <Text style={styles.subtitle}>Recent Attendance</Text>
          )}
          <Text style={styles.subtitle}>Select a session:</Text>
          {sessions.map((s) => (
          <TouchableOpacity
              key={s.qr_id}
              onPress={() => loadAttendance(s)}
              style={styles.sessionItem}
          >
              <Text>
                {s.class_name} — {
                  new Date(new Date(s.generated_at).getTime() + 4 * 60 * 60 * 1000).toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                }
              </Text>
          </TouchableOpacity>
          ))}
      </View>
      )}
      {!loading && sessions.length === 0 && (
        <Text style={styles.subtitle}>No sessions found for this date.</Text>
      )}
      {selectedSession && (
        <View>
          <AttendanceGauge
            percentage={computeAttendancePercent()}
            label={`Attendance for ${selectedSession.class_name}`}
          />

          <Text style={styles.subtitle}>Student Attendance:</Text>
          {attendance.map((a) => (
            <View key={a.attendance_id} style={styles.studentRow}>
              <Text style={{ flex: 1 }}>{a.first_name} {a.last_name}</Text>
              <View style={styles.statusButtons}>
              {['present', 'late', 'absent'].map((status) => (
                <TouchableOpacity
                    key={status}
                    onPress={() => updateAttendance(a.student_id, status as 'present' | 'late' | 'absent')}
                    style={[
                    styles.statusButton,
                    a.status === status && styles.activeStatus,
                    ]}
                >
                    <Text style={styles.statusText}>{status[0].toUpperCase()}</Text>
                </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
      <View style={{ alignItems: 'center', marginVertical: 12 }}>
        <TouchableOpacity onPress={() => setShowPicker((prev) => !prev)}>
          <Text style={{ color: '#7C3AED', fontSize: 16, fontWeight: '500' }}>
            📅 Select Date: {date.toDateString()}
          </Text>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <View style={{ alignItems: 'center', marginVertical: 10 }}>
          {Platform.OS === 'web' ? (
            <View style={{ maxWidth: 320 }}>
              <DatePicker
                selected={date}
                onChange={(selectedDate: Date | null) => {
                  if (selectedDate) {
                    setDate(selectedDate);
                    setDateSelected(true);
                    fetchSessionsForDate(selectedDate);
                  }
                  setShowPicker(false);
                }}
                inline
              />
            </View>
          ) : (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(e, selected) => {
                setShowPicker(Platform.OS === 'ios');
                if (selected) {
                  setDate(selected);
                  setDateSelected(true);
                  fetchSessionsForDate(selected);
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
              setSessions(allSessions.slice(0, 10));
              setSelectedSession(null);
              setDateSelected(false);
            }}
          >
            <Text style={{ color: '#7C3AED', fontSize: 16, fontWeight: '500' }}>
              🔄 Show Recent Sessions
            </Text>
          </TouchableOpacity>
        </View>
      )}
      </View>
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
  responsiveWrapper: {
    width: '100%',
    alignSelf: 'center',
    ...(Platform.OS === 'web' && {
      maxWidth: '60%',
    }),
  },
});