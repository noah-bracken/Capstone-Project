import React from 'react';
import { TouchableOpacity, Text, Platform, View } from 'react-native';
import * as Print from 'expo-print';
import QRCode from 'qrcode';
import styles from '../../../../components/capstone/styles'

interface Props {
  classId: string;
  sessionToken: string;
}

const PrintQRCode: React.FC<Props> = ({ classId, sessionToken }) => {
  const handlePrintWeb = async () => {
    try {
      const token = sessionToken;
  
      // ✅ Fetch latest session like ClassQRCode does
      const res = await fetch(`https://capstone-db-lb2e.onrender.com/classes/${classId}/latest-session`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        throw new Error(`Failed to fetch session (${res.status})`);
      }
  
      const data = await res.json();
  
      if (!data || !data.session_token) {
        alert('No active QR session found.');
        return;
      }
  
      const qrValue = JSON.stringify({
        class_id: classId,
        session_token: data.session_token,
      });
  
      const qrDataUrl = await QRCode.toDataURL(qrValue);
  
      const html = `
        <html>
          <head>
            <title>QR Code</title>
            <style>
              @media print {
                @page { size: auto; margin: 0; }
                body { margin: 0; }
              }
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background: white;
              }
              img {
                width: 256px;
                height: 256px;
              }
            </style>
          </head>
          <body>
            <img src="${qrDataUrl}" alt="QR Code" />
            <script>
              window.onload = () => {
                window.print();
                window.onafterprint = () => window.close();
                setTimeout(() => window.close(), 500); // fallback
              };
            </script>
          </body>
        </html>
      `;
  
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();
      }
    } catch (error) {
      console.error('Error printing QR code:', error);
      alert('Failed to load attendance session.');
    }
  };    
  
  if (Platform.OS !== 'web') return null;

  return (
    <View>
      <TouchableOpacity onPress={handlePrintWeb} style={styles.homeButton}>
        <Text style={styles.buttonText}>🖨️ Print QR Code</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PrintQRCode;
