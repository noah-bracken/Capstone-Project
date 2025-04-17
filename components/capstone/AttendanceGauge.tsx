import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Circle } from 'react-native-svg';

interface Props {
    percentage: number;
    label: string;
  }  

export default function AttendanceGauge({ percentage, label }: Props) {
  const radius = 40;
  const strokeWidth = 8;
  const center = radius + strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const safePercentage = isNaN(percentage) ? 0 : Math.max(0, Math.min(percentage, 100));
  const strokeDashoffset = circumference - (circumference * safePercentage) / 100;

  return (
    <View style={styles.container}>
      <Svg width={2 * center} height={2 * center}>
        <Circle
          stroke="#E5E7EB"
          fill="none"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke="#3B82F6"
          fill="none"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>
      <Text style={styles.percentText}>{safePercentage}%</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 12,
  },
  percentText: {
    position: 'absolute',
    top: '40%',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  label: {
    marginTop: 4,
    fontSize: 14,
    color: '#334155',
    textAlign: 'center',
  },
});
