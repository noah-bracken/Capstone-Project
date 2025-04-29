import React, { useRef } from 'react';
import { Animated, TouchableOpacity, View, Text } from 'react-native';
import styles from '../../components/capstone/styles';
import { useRouter } from 'expo-router';

export default function AnimatedClassCard({ cls }: { cls: any }) {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 1.05,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleNavigate = () => {
    router.push({
      pathname: '/(tabs)/classDetails/[id]',
      params: { id: cls.class_id },
    });
  };

  return (
    <Animated.View style={{ transform: [{ scale }], marginBottom: 12 }}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleNavigate}
        style={styles.classCard}
        activeOpacity={0.9}
      >
        <View
          style={[
            styles.classCardHeader,
            { backgroundColor: cls.color || '#4C1D95' },
          ]}
        >
          <Text style={styles.classCardTitle}>{cls.class_name}</Text>
        </View>
        <View style={styles.classCardBody}>
          <Text style={styles.classCardDescription}>
            {cls.description || 'No description provided.'}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
