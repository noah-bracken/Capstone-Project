import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://capstone-db-lb2e.onrender.com';

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

// Fetch attendance summary for a class
export const fetchAttendanceSummary = async (classId: string) => {
  const headers = await getAuthHeader();
  const response = await axios.get(`${API_URL}/classes/${classId}/attendance-summary`, { headers });
  return response.data;
};

// Fetch list of sessions for a class
export const fetchClassSessions = async (classId: string) => {
  const headers = await getAuthHeader();
  const response = await axios.get(`${API_URL}/classes/${classId}/sessions`, { headers });
  return response.data;
};

// Fetch attendance for a specific session
export const fetchSessionAttendance = async (classId: string, sessionId: number) => {
  const headers = await getAuthHeader();
  const response = await axios.get(`${API_URL}/classes/${classId}/sessions/${sessionId}/attendance`, { headers });
  return response.data;
};

// Manually mark or update attendance
export const markAttendanceManually = async (
  classId: string,
  sessionId: number,
  studentId: number,
  status: 'present' | 'absent' | 'late'
) => {
  const headers = await getAuthHeader();
  const response = await axios.post(`${API_URL}/attendance/manual`, {
    class_id: classId,
    session_id: sessionId,
    student_id: studentId,
    status
  }, { headers });

  return response.data;
};
