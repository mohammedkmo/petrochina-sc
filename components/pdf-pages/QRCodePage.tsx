'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { 
  compressData,
  getCompressionInfo,
  validateCompressedData
} from '../../lib/simple-compression';

interface FormData {
  companyNameEnglish?: string;
  companyNameArabic?: string;
  authorizedPersonName?: string;
  contactInfo?: string;
  localStaffCount?: number;
  internationalStaffCount?: number;
  vehiclesCount?: number;
  weaponsCount?: number;
  entryApprovalType?: string;
  contractedWithEnglish?: string;
  contractedWithArabic?: string;
  contractNumber?: string;
}

interface QRCodePageProps {
  data: FormData;
}

interface CleanData extends Record<string, unknown> {
  companyNameEnglish: string;
  companyNameArabic: string;
  authorizedPersonName: string;
  contactInfo: string;
  localStaffCount: number;
  internationalStaffCount: number;
  vehiclesCount: number;
  weaponsCount: number;
  entryApprovalType: string;
  contractedWithEnglish: string;
  contractedWithArabic: string;
  contractNumber: string;
}

const QRCodePage: React.FC<QRCodePageProps> = ({ data }) => {
  const [compressedData, setCompressedData] = useState<string>('');
  const [compressionInfo, setCompressionInfo] = useState<{
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
    spaceSaved: number;
  } | null>(null);
  const [isValid, setIsValid] = useState<boolean>(false);

  // Compress and encrypt data when component mounts or data changes
  useEffect(() => {
    // Create a minimal JSON object with only essential fields to avoid QR code size limits
    const cleanData: CleanData = {
      // Company Information
      companyNameEnglish: data.companyNameEnglish || '',
      companyNameArabic: data.companyNameArabic || '',
      
      // Authorized Representative
      authorizedPersonName: data.authorizedPersonName || '',
      contactInfo: data.contactInfo || '',
      
      // Counts
      localStaffCount: data.localStaffCount || 0,
      internationalStaffCount: data.internationalStaffCount || 0,
      vehiclesCount: data.vehiclesCount || 0,
      weaponsCount: data.weaponsCount || 0,
      
      // Entry approval type and contract info
      entryApprovalType: data.entryApprovalType || '',
      contractedWithEnglish: data.contractedWithEnglish || '',
      contractedWithArabic: data.contractedWithArabic || '',
      contractNumber: data.contractNumber || ''
    };

    try {
      // Simple compression
      const compressed = compressData(cleanData);
      setCompressedData(compressed);
      
      // Get compression information
      const info = getCompressionInfo(cleanData, compressed);
      setCompressionInfo(info);
      
      // Validate the compressed data
      const valid = validateCompressedData(compressed);
      setIsValid(valid);
      
      console.log(`Compression: ${info.compressionRatio}% reduction (${info.originalSize} → ${info.compressedSize} chars)`);
    } catch (error) {
      console.error('Error compressing data:', error);
      setCompressedData('');
      setIsValid(false);
    }
  }, [data]);

  return (
    <div className="w-full h-[100vh] bg-white p-8 flex flex-col items-center justify-center">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          QR Code - Security Clearance Application Data
        </h1>
        <h2 className="text-xl font-bold text-gray-600 mb-4" dir="rtl">
          رمز الاستجابة السريعة - بيانات طلب التصريح الأمني
        </h2>
        <p className="text-sm text-gray-600">
          Scan the QR code below to access all submitted form data in digital format
        </p>
        <p className="text-sm text-gray-600" dir="rtl">
          امسح رمز الاستجابة السريعة أدناه للوصول إلى جميع بيانات النموذج المقدم بالتنسيق الرقمي
        </p>
      </div>

      {/* QR Code */}
      <div className="flex flex-col items-center">
        <div className="bg-white p-6 border-2 border-gray-100 rounded-xl mb-6">
          {compressedData && isValid ? (
            <QRCode
              value={compressedData}
              size={300}
              level="M"
              bgColor="#FFFFFF"
              fgColor="#000000"
            />
          ) : (
            <div className="w-[300px] h-[300px] flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300">
              <p className="text-gray-500 text-center">
                {compressedData ? 'Invalid Data' : 'Loading...'}
              </p>
            </div>
          )}
        </div>
        
        {/* Instructions */}
        <div className="text-center max-w-md">
          <p className="text-xs text-gray-500 mt-2">
            <strong>Note:</strong> Data uses advanced multi-algorithm compression and encryption for maximum size optimization.
          </p>
          <p className="text-xs text-gray-500" dir="rtl">
            <strong>ملاحظة:</strong> البيانات تستخدم ضغط متقدم متعدد الخوارزميات وتشفير لتحسين الحجم إلى أقصى حد.
          </p>
        </div>

        {/* Metadata */}
        <div className="mt-6 text-center">
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