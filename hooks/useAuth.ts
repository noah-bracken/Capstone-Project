import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export const useAuth = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken'); // Clear token
      router.replace('/login'); // Redirect to login screen
    } catch (error) {
      console.error(' Error logging out:', error);
    }
  };

  return { logout };
};
