import React, { useEffect, useState } from 'react';
import { View, Platform } from 'react-native';
import * as Splash from 'expo-splash-screen';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { ClassProvider } from '../context/ClassContext';
import { Stack } from 'expo-router';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Warning: Do not call Hooks inside useEffect',
  'Reminder check error: TypeError',
  'Error fetching classes'
]);

Splash.preventAutoHideAsync();

export default function RootLayout() {
  const [isAppReady, setAppReady] = useState(false);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    const prepareApp = async () => {
      if (Platform.OS === 'web') {
        setAppReady(true);
        return;
      }

      await Splash.hideAsync();
      logoOpacity.value = withTiming(1, { duration: 1000 });

      setTimeout(() => {
        setAppReady(true);
      }, 2000);
    };

    prepareApp();
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
  }));

  if (!isAppReady && Platform.OS !== 'web') {
    return (
      <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
        <Animated.Image
          source={require('../assets/images/logo.png')}
          style={[{ width: 220, height: 220 }, logoStyle]}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <ClassProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(tabs)/classDetails/[id]" />
        <Stack.Screen name="addClass" />
      </Stack>
    </ClassProvider>
  );
}
