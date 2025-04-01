import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClassType } from '../app/types';

const API_URL = 'https://capstone-db-lb2e.onrender.com';

//Retrieve stored JWT token
const getToken = async () => {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

//Add Class with meeting times
export const createClass = async ({
  class_name,
  description,
  meeting_times,
  color,
}: {
  class_name: string;
  description: string;
  meeting_times: { day: string; hour: string; minute: string }[];
  color: string;
}) => {
  try {
    const token = await getToken();
    if (!token) {
      console.error('No token found. Authentication failed.');
      return null;
    }

    const response = await fetch(`${API_URL}/classes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        class_name,
        description,
        meeting_times,
        color,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`Server Error (${response.status}):`, errorMessage);
      return null;
    }

    const data = await response.json();
    console.log('Class added:', data);
    return data;
  } catch (error) {
    console.error('Error adding class:', error);
    return null;
  }
};
// fetch meeting times
export const fetchMeetingTimes = async (classId: string) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.error('No token found.');
      return [];
    }

    const response = await fetch(`${API_URL}/classes/${classId}/meeting-times`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch meeting times for class ${classId}`);
      return [];
    }

    const data = await response.json();
    return data; // returns [{ day: 'Monday', time: '14:30' }, ...]
  } catch (error) {
    console.error('Error fetching meeting times:', error);
    return [];
  }
};

//Delete Class
export const deleteClass = async (class_id: string) => {
  try {
    const token = await getToken();
    if (!token) {
      console.error('No token found. Authentication failed.');
      return null;
    }

    const response = await fetch(`${API_URL}/classes/${class_id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Delete failed:', errorData);
      return null;
    }

    const data = await response.json();
    console.log('Server response:', data);
    return data;
  } catch (error) {
    console.error('Error deleting class:', error);
    return null;
  }
};

//Fetch All Classes
export const useFetchClasses = () => {
  const [classes, setClasses] = useState<ClassType[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.error('No token found. Authentication failed.');
          return;
        }

        const response = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          console.error(`Error fetching classes (${response.status})`);
          return;
        }

        const data: ClassType[] = await response.json();
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, []);

  return classes;
};

//Fetch Students in Class
export const useFetchStudents = (classId: number) => {
  const [students, setStudents] = useState<{ user_id: number; first_name: string; last_name: string }[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.error('No token found. Authentication failed.');
          return;
        }

        const response = await fetch(`${API_URL}/${classId}/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          console.error(`Error fetching students (${response.status})`);
          return;
        }

        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [classId]);

  return students;
};

// Join Class by Code
export const joinClass = async (classCode: string) => {
  try {
    const token = await getToken();
    if (!token) throw new Error('No token found. Please log in.');

    const response = await fetch(`${API_URL}/enroll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ class_id: classCode }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to join class.');
    }

    return data;
  } catch (error) {
    console.error('Join class error:', error);
    throw error;
  }
};
