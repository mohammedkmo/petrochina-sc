'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

interface FormData {
  contractNumber?: string;
  localStaffCount?: number;
  internationalStaffCount?: number;
  vehiclesCount?: number;
  weaponsCount?: number;
  clearanceType?: string;
  entryApprovalType?: string;
}

interface QRCodePageProps {
  data: FormData;
}

interface CleanData extends Record<string, unknown> {
  contractNumber: string;
  localStaffCount: number;
  internationalStaffCount: number;
  vehiclesCount: number;
  weaponsCount: number;
  clearanceType: string;
  entryApprovalType: string;
}

const QRCodePage: React.FC<QRCodePageProps> = ({ data }) => {
  const [qrData, setQrData] = useState<string>('');

  // Generate plain JSON when component mounts or data changes
  useEffect(() => {
    // Create a minimal JSON object with only essential fields
    const cleanData: CleanData = {
      contractNumber: data.contractNumber || '',
      localStaffCount: data.localStaffCount || 0,
      internationalStaffCount: data.internationalStaffCount || 0,
      vehiclesCount: data.vehiclesCount || 0,
      weaponsCount: data.weaponsCount || 0,
      clearanceType: data.clearanceType || '',
      entryApprovalType: data.entryApprovalType || ''
    };

    try {
      // Convert to plain JSON string
      const jsonString = JSON.stringify(cleanData);
      setQrData(jsonString);
      
      console.log('QR Code data:', cleanData);
    } catch (error) {
      console.error('Error creating QR data:', error);
      setQrData('');
    }
  }, [data]);

  return (
    <div className="w-full h-[100vh] bg-gradient-to-b from-gray-50 to-white p-8 flex flex-col items-center justify-center">
      {/* Header */}
      <div className="text-center mb-8 max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          QR Code - Security Clearance Application Data
        </h1>
        <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-4" dir="rtl">
          رمز الاستجابة السريعة - بيانات طلب التصريح الأمني
        </h2>
        <p className="text-sm md:text-base text-gray-600 mb-2">
          Scan the QR code below to access all submitted form data in digital format
        </p>
        <p className="text-sm md:text-base text-gray-600" dir="rtl">
          امسح رمز الاستجابة السريعة أدناه للوصول إلى جميع بيانات النموذج المقدم بالتنسيق الرقمي
        </p>
      </div>

      {/* QR Code */}
      <div className="flex flex-col items-center">
        <div className="bg-white p-6 border-2 border-gray-200 rounded-2xl mb-6">
          {qrData ? (
            <QRCode
              value={qrData}
              size={300}
              level="M"
              bgColor="#FFFFFF"
              fgColor="#000000"
            />
          ) : (
            <div className="w-[300px] h-[300px] flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500 text-center">
                Loading...
              </p>
            </div>
          )}
        </div>
        
        {/* Instructions */}
        <div className="text-center max-w-md space-y-2">
          <p className="text-xs md:text-sm text-gray-600 mt-2">
            <strong className="font-semibold">Note:</strong> Scan the QR code to get the data in JSON format.
          </p>
          <p className="text-xs md:text-sm text-gray-600" dir="rtl">
            <strong className="font-semibold">ملاحظة:</strong> امسح رمز الاستجابة السريعة للحصول على البيانات بتنسيق JSON.
          </p>
        </div>

        {/* Metadata */}
        <div className="mt-6 text-center space-y-1">
          <p className="text-xs text-gray-400">
            Generated: {new Date().toLocaleString()}
          </p>
          <p className="text-xs text-gray-400">
            Form Version: 1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;