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
    return data;
  } catch (error) {
    console.error('Error fetching meeting times:', error);
    return [];
  }
};
//Fetch class settings
export const fetchClassSettings = async (classId: string) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_URL}/classes/${classId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch class settings');
    }

    const classData = await response.json();
    const timesResponse = await fetch(`${API_URL}/classes/${classId}/meeting-times`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!timesResponse.ok) {
      throw new Error('Failed to fetch meeting times');
    }

    const meeting_times = await timesResponse.json();

    return {
      ...classData,
      meeting_times,
    };
  } catch (error) {
    console.error('fetchClassSettings error:', error);
    throw error;
  }
};

// Update class settings
export const updateClass = async (
  classId: string,
  className: string,
  description: string,
  color: string,
  meetingTimes: { day: string; hour: string; minute: string }[]
) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_URL}/classes/${classId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        class_name: className,
        description,
        color,
        meeting_times: meetingTimes,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Failed to update class:", error);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Update error:", err);
    return null;
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
//Delete users
export const deleteAccount = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_URL}/delete-account`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete account');
    }

    return data;
  } catch (err) {
    console.error('deleteAccount error:', err);
    throw err;
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

export const fetchStudentDetails = async (studentId: number) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const response = await fetch(`${API_URL}/students/${studentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch student details.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching student details:', error);
    throw error;
  }
};

// Store qr session token in DB
export async function storeSessionToken(classId: string, token: string, timestamp: number) {
  const response = await fetch(`${API_URL}/classes/${classId}/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_token: token, timestamp }),
  });
  return await response.json();
}

// Validate token
export async function validateSessionToken(classId: string, token: string) {
  const response = await fetch(`${API_URL}/classes/${classId}/validate-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_token: token }),
  });
  const data = await response.json();
  return data.valid;
}
//register new device
export async function storeDeviceId(userId: number, deviceId: string) {
  const response = await fetch(`${API_URL}/bind-device`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId, device_id: deviceId }),
  });

  if (!response.ok) {
    throw new Error('Failed to bind device');
  }

  return await response.json();
}

//validate device on login
export async function validateDevice(userId: number, deviceId: string) {
  const response = await fetch(`${API_URL}/device/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, deviceId }),
  });

  const result = await response.json();
  return result.valid;
}

export async function deleteDeviceId() {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_URL}/devices`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.ok;
}

export async function verifyDevice(userId: number, deviceId: string) {
  const response = await fetch(`${API_URL}/verify-device`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, device_id: deviceId }),
  });

  if (!response.ok) {
    throw new Error('Unauthorized device (server check)');
  }

  return await response.json();
}

export async function getCurrentUserId() {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_URL}/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch user ID');

  const data = await response.json();
  return data.user_id;
}
