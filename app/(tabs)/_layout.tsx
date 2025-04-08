import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
<<<<<<< HEAD
    <Tabs screenOptions={{ 
        headerShown: false,
        tabBarStyle: { display: 'none' }
      }}>
=======
    <Tabs screenOptions={{ headerShown: false }}>
>>>>>>> main
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />

      {/* Class Tab */}
      <Tabs.Screen
        name="class"
        options={{
          title: 'Class',
        }}
      />

      {/* Add Class Tab */}
      <Tabs.Screen
        name="add-class"
        options={{
          title: 'Add Class',
        }}
      />
      {/* Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Tabs>
  );
}
