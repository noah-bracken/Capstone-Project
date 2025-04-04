import React from 'react';
import { TouchableOpacity, Text, Platform, View } from 'react-native';
import * as Print from 'expo-print';
import QRCode from 'qrcode';

interface Props {
  classId: string;
  sessionToken: string;
}

const PrintQRCode: React.FC<Props> = ({ classId, sessionToken }) => {
  const handlePrintWeb = async () => {
  const qrValue = JSON.stringify({ classId, sessionToken });
  const qrDataUrl = await QRCode.toDataURL(qrValue);

  const html = `
    <html>
      <head>
        <title>QR Code</title>
      </head>
      <body style="margin:0; padding:40px; background:white; display:flex; justify-content:center; align-items:center; height:100vh;">
        <img id="qr" src="${qrDataUrl}" width="256" height="256" />
        <script>
          const img = document.getElementById('qr');
          img.onload = () => {
            window.print();
            window.onafterprint = () => window.close();
          };
        </script>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
};

  if (Platform.OS !== 'web') return null;

  return (
    <View style={{ marginTop: 10 }}>
      <TouchableOpacity
        onPress={handlePrintWeb}
        style={{
          padding: 10,
          backgroundColor: '#4C1D95',
          borderRadius: 6,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>🖨️ Print QR Code</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PrintQRCode;
