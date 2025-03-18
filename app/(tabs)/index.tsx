import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useClassContext } from '../context/ClassContext';
import { getToken } from '../../hooks/auth';
import styles from '../components/styles';

export default function HomeScreen() {
  const router = useRouter();
  const { classes, refreshClasses } = useClassContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      if (!token) {
        router.replace('/login');
      } else {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, []);

  if (!isAuthenticated) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NOMark</Text>
      <Text style={styles.sectionTitle}>Your Classes</Text>
      <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('/settings')}>
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>
      <ScrollView>
        {classes.length > 0 ? (
          classes.map((cls) => (
            <TouchableOpacity key={cls.class_id} style={styles.classButton}
            onPress={() => router.push({ pathname: '/classDetails/[id]', params: { id: String(cls.class_id) } })}>
              <Text style={styles.classButtonText}>{cls.class_name}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text>No classes available</Text>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.addClassButton} onPress={() => router.push('/addClass')}>
        <Text style={styles.addClassText}>+ Add Class</Text>
      </TouchableOpacity>
    </View>
  );
}
