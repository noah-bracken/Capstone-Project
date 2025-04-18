import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  Button,
  useWindowDimensions,
  Platform,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { terms, preamble, footer } from './termsContent';

type Props = {
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
};

export default function TermsModal({ visible, onAccept, onDecline }: Props) {
  const { width } = useWindowDimensions();
  const isMobile = Platform.OS !== 'web' || width < 600;
  const modalWidth = isMobile ? '80%' : '50%';

  const [readChecked, setReadChecked] = useState(false);
  const [acceptChecked, setAcceptChecked] = useState(false);
  const [declineChecked, setDeclineChecked] = useState(false);

  const handleAcceptChange = (newValue: boolean) => {
    if (!readChecked) return;
    setAcceptChecked(newValue);
    if (newValue) setDeclineChecked(false);
  };

  const handleDeclineChange = (newValue: boolean) => {
    setDeclineChecked(newValue);
    if (newValue) setAcceptChecked(false);
  };

  const BulletList = ({ items }: { items: string[] }) => (
    <View style={{ paddingLeft: 16, marginBottom: 8 }}>
      {items.map((item, index) => (
        <Text key={index} style={{ fontSize: 14, marginBottom: 4 }}>{'\u2022'} {item}</Text>
      ))}
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }}>
        <View style={{ width: modalWidth, backgroundColor: 'white', padding: 24, borderRadius: 12, maxHeight: '85%' }}>
          <ScrollView style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' }}>
              NOMark Terms and Conditions of Use (A Satirical Legal Odyssey)
            </Text>

            <Text style={{ fontSize: 14, marginBottom: 16 }}>{preamble}</Text>

            {terms.map((section, idx) => (
              <View key={idx} style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 6 }}>{section.title}</Text>
                <BulletList items={section.clauses} />
              </View>
            ))}

            <Text style={{ fontSize: 12, marginBottom: 8 }}>{footer}</Text>
            <Text style={{ fontSize: 12, fontStyle: 'italic', marginBottom: 12 }}>
              May NOMark bless your attendance, and may your QR scans always be aligned.
            </Text>
          </ScrollView>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Checkbox value={readChecked} onValueChange={setReadChecked} />
            <Text style={{ marginLeft: 8 }}>I have read the Terms and Conditions</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Checkbox
              value={acceptChecked}
              onValueChange={handleAcceptChange}
              disabled={!readChecked}
            />
            <Text style={{ marginLeft: 8, color: !readChecked ? '#888' : '#000' }}>
              I accept the Terms and Conditions
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <Checkbox value={declineChecked} onValueChange={handleDeclineChange} />
            <Text style={{ marginLeft: 8 }}>I decline the Terms and Conditions</Text>
          </View>

          <View>
            <Button
              title="Continue"
              onPress={acceptChecked ? onAccept : onDecline}
              disabled={!acceptChecked && !declineChecked}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
