import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { AttendanceRecord, Session } from '../../../../components/capstone/types';
import {
  fetchClassSessions,
  fetchSessionAttendance,
  markAttendanceManually
} from '../../../../hooks/attendance';

export default function AttendanceHistoryScreen() {
  const statuses = ['present', 'absent', 'late'] as const;
  type StatusType = typeof statuses[number];
  const { classID } = useLocalSearchParams();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSessions = async () => {
      const data = await fetchClassSessions(classID as string);
      setSessions(data);
      if (data.length > 0) {
        setSelectedSession(data[0].session_id);
      }
    };
    loadSessions();
  }, [classID]);

  useEffect(() => {
    const loadAttendance = async () => {
      if (!selectedSession) return;
      setLoading(true);
      const data = await fetchSessionAttendance(classID as string, selectedSession);
      setAttendance(data);
      setLoading(false);
    };
    loadAttendance();
  }, [selectedSession]);

  const updateStatus = async (
    studentId: number,
    newStatus: StatusType
  ) => {
    if (selectedSession === null) return;
  
    await markAttendanceManually(
      classID as string,
      selectedSession,
      studentId,
      newStatus
    );
  
    setAttendance((prev) =>
      prev.map((a) =>
        a.user_id === studentId ? { ...a, status: newStatus } : a
      )
    );
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Attendance History</Text>
  
      {/* Session Selector */}
      <Picker
        selectedValue={selectedSession}
        onValueChange={(val) => setSelectedSession(val)}
        style={{ marginVertical: 16 }}
      >
        {sessions.map((s) => (
          <Picker.Item
            key={s.session_id}
            label={new Date(s.generated_at).toLocaleString()}
            value={s.session_id}
          />
        ))}
      </Picker>
  
      {/* Attendance List */}
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={attendance}
          keyExtractor={(item) => item.user_id.toString()}
          renderItem={({ item }) => (
            <View style={{ marginVertical: 8 }}>
              <Text style={{ fontSize: 16, marginBottom: 4 }}>
                {item.first_name} {item.last_name}
              </Text>
  
              <View style={{ flexDirection: 'row' }}>
                {statuses.map((status) => (
                  <TouchableOpacity
                    key={status}
                    onPress={() => updateStatus(item.user_id, status)}
                    style={{
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      marginRight: 8,
                      backgroundColor:
                        item.status === status ? '#3B82F6' : '#E5E7EB',
                      borderRadius: 6,
                    }}
                  >
                    <Text
                      style={{
                        color: item.status === status ? '#fff' : '#000',
                        fontWeight: item.status === status ? '600' : 'normal',
                      }}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
