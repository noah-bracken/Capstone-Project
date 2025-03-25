import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClassType } from '../types'; // Import the type
const API_URL = 'https://capstone-db-lb2e.onrender.com/classes'; // Update if deployed
// Define context type
type ClassContextType = {
  classes: any[];
  refreshClasses: () => void;
};

const getToken = async () => {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.error(' Error retrieving token:', error);
    return null;
  }
};

// Create context
const ClassContext = createContext<ClassContextType | undefined>(undefined);

// Hook to use ClassContext
export const useClassContext = () => {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error("useClassContext must be used within a ClassProvider");
  }
  return context;
};

// Context Provider
export const ClassProvider = ({ children }: { children: React.ReactNode }) => {
  const [classes, setClasses] = useState<ClassType[]>([]);
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
    useEffect(() => {
      fetchClasses();
    }, []);

  return (
    <ClassContext.Provider value={{ classes, refreshClasses: fetchClasses }}>
      {children}
    </ClassContext.Provider>
  );
};
