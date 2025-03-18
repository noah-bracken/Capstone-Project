import React, { createContext, useState, useContext, useEffect } from 'react';

const API_URL = 'http://localhost:5000/classes'; // Update if deployed

// Define context type
type ClassContextType = {
  classes: any[];
  refreshClasses: () => void;
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
  const [classes, setClasses] = useState<any[]>([]);

  // Fetch classes from API
  const fetchClasses = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
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
