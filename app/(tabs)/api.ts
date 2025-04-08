import { getToken } from '../hooks/auth'; // adjust path if needed

const API_URL = 'https://capstone-db-lb2e.onrender.com';

export const getAttendanceForClass = async (classId: number) => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/attendance?class_id=${classId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
};

export const markAttendance = async (classId: number, studentId: number, status: string) => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/attendance/mark`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ class_id: classId, student_id: studentId, status }),
  });
  return await response.json();
};

export const getMyAttendance = async () => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/attendance/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
};
