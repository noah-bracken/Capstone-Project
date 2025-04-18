import React from 'react';
import { View, useWindowDimensions, StyleSheet } from 'react-native';
import AttendanceGauge from '../../components/capstone/AttendanceGauge';

type Props = {
  total: number;
  recent: number;
};

export default function QuartileGaugeLayout({ total, recent }: Props) {
  const { width } = useWindowDimensions();
  const gaugeWidth = 160;
  const center1 = width * 0.25 - gaugeWidth / 2;
  const center3 = width * 0.75 - gaugeWidth / 2;

  return (
    <>
      <View style={[styles.gaugeWrapper, { left: center1 }]}>
        <AttendanceGauge percentage={total} label="Total Attendance" />
      </View>
      <View style={[styles.gaugeWrapper, { left: center3 }]}>
        <AttendanceGauge percentage={recent} label="Last Session" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  gaugeWrapper: {
    position: 'absolute',
    top: 0,
  },
});
