// app/components/SplashScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useRouter } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function CustomSplashScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const router = useRouter();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start(async () => {
      setTimeout(async () => {
        await SplashScreen.hideAsync();
        router.replace('/');
      }, 1500);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/images/logo.png')}
        style={[styles.logo, { opacity: fadeAnim }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 220,
    height: 220,
  },
});
