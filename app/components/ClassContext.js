import React, { useState } from "react";

export default function useClassManager() {
  const [classes, setClasses] = useState([]);

  // Function to add a new class
  const addClass = (name) => {
    const newClass = { id: Date.now().toString(), name, students: [] };
    setClasses([...classes, newClass]); // Add new class to the list
  };

  return { classes, addClass };
}
