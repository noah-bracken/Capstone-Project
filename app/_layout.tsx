<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { View, Platform } from 'react-native';
import * as Splash from 'expo-splash-screen';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { ClassProvider } from './context/ClassContext';
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
        <Stack.Screen name="classDetails/[id]" />
        <Stack.Screen name="addClass" />
      </Stack>
    </ClassProvider>
  );
}
=======
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
>>>>>>> main
