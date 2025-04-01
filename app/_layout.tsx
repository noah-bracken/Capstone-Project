import * as SplashScreen from 'expo-splash-screen';
import { ClassProvider } from './context/ClassContext';
import { Stack } from 'expo-router';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <ClassProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
        <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
        <Stack.Screen name="classDetails/[id]" options={{ title: 'Class Details' }} />
        <Stack.Screen name="addClass" options={{ title: 'Add Class' }} />
      </Stack>
    </ClassProvider>
  );
}