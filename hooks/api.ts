import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClassType } from '../app/types'; // Import the type

const API_URL = 'https://capstone-db-lb2e.onrender.com';

// Function to retrieve stored JWT token
const getToken = async () => {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.error(' Error retrieving token:', error);
    return null;
  }
};

// Modify `addClass` to include the JWT token in headers
export const addClass = async (className: string, description: string, meetingTimes: any[], color: string, teacherId: number) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      console.error(' No token found, authentication failed');
      return null;
    }

    console.log("Sending request with token:", token);

    const response = await fetch(`${API_URL}/classes`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Include Token
      },
      body: JSON.stringify({ 
        class_name: className, 
        description, 
        meeting_times: meetingTimes, 
        color, 
        teacher_id: teacherId
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`Server Error (${response.status}):`, errorMessage);
      return null;
    }

    const data = await response.json();
    console.log(" Class added:", data);
    return data;
  } catch (error) {
    console.error(' Error adding class:', error);
  }
};

// Modify `deleteClass` to include authentication token
export const deleteClass = async (class_id: number) => {
  try {
    const token = await getToken();
    if (!token) {
      console.error(' No token found, authentication failed');
      return null;
    }

    console.log(`Sending DELETE request to: ${API_URL}/${class_id}`);

    const response = await fetch(`${API_URL}/classes/${class_id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }, // Include token
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Delete failed:", errorData);
      return null;
    }

    const data = await response.json();
    console.log(" Server response:", data);
    return data;
  } catch (error) {
    console.error(' Error deleting class:', error);
    return null;
  }
};

// Modify `useFetchClasses` to send token
export const useFetchClasses = () => {
  const [classes, setClasses] = useState<ClassType[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.error(' No token found, authentication failed');
          return;
        }
        console.log("Token being sent:", token);
        const response = await fetch(API_URL, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          console.error(` Error fetching classes (${response.status})`);
          return;
        }

        const data: ClassType[] = await response.json();
        setClasses(data);
      } catch (error) {
        console.error(' Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, []);

  return classes;
};

// Modify `useFetchStudents` to send token
export const useFetchStudents = (classId: number) => {
  const [students, setStudents] = useState<{ user_id: number; first_name: string; last_name: string }[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.error(' No token found, authentication failed');
          return;
        }

        const response = await fetch(`${API_URL}/${classId}/students`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          console.error(` Error fetching students (${response.status})`);
          return;
        }

        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error(' Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [classId]);

  return students;
};
