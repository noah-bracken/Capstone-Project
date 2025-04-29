import { Platform, View, Text } from 'react-native';
import React, { useState } from 'react';

import DateTimePicker from '@react-native-community/datetimepicker';

let ReactDatePicker: any;
if (Platform.OS === 'web') {
  ReactDatePicker = require('react-datepicker').default;
  require('react-datepicker/dist/react-datepicker.css');
}

export default function CrossPlatformDatePicker({
  date,
  onChange,
}: {
  date: Date;
  onChange: (newDate: Date) => void;
}) {
  const [show, setShow] = useState(false);

  if (Platform.OS === 'web') {
    return (
      <View>
        <ReactDatePicker
          selected={date}
          onChange={(d: Date) => onChange(d)}
          dateFormat="yyyy-MM-dd"
        />
      </View>
    );
  }

  return (
    <View>
      <Text onPress={() => setShow(true)} style={{ padding: 10, backgroundColor: '#eee' }}>
        📅 {date.toDateString()}
      </Text>
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setShow(false);
            if (selectedDate) onChange(selectedDate);
          }}
        />
      )}
    </View>
  );
}
