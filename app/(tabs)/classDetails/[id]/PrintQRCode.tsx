import React from 'react';
import { TouchableOpacity, Text, Platform, View } from 'react-native';
import QRCode from 'qrcode';
import styles from '../../../components/styles'

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
          <style>
            @media print {
              @page {
                size: auto;
                margin: 0;
              }
              body {
                margin: 0;
                box-sizing: border-box;
              }
            }

            body {
              background: white;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100%;
              width: 100%;
            }

            .wrapper {
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 40px;
              box-sizing: border-box;
              page-break-inside: avoid;
            }

            img {
              width: 256px;
              height: 256px;
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <img id="qr" src="${qrDataUrl}" alt="QR Code" />
          </div>
          <script>
            function closeWindow() {
              setTimeout(() => window.close(), 500);
            }

            window.onload = () => {
              const img = document.getElementById('qr');
              const triggerPrint = () => {
                window.print();
                window.onafterprint = closeWindow;
                setTimeout(() => window.close(), 100); // fallback
              };

              if (img.complete) {
                triggerPrint();
              } else {
                img.onload = triggerPrint;
              }
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
