import React from 'react';
import QRCode from 'react-qr-code';

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

interface CleanData {
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

  // Create JSON string for display
  const jsonString = JSON.stringify(cleanData, null, 2);
  
  // For PDF generation, we'll display the JSON data directly
  // since QR code generation requires async operations that don't work in PDF context

  return (
    <div className="w-full h-full bg-white p-8 flex flex-col items-center justify-center">
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
        <div className="bg-white p-6 border-2 border-gray-300 rounded-lg shadow-md mb-6">
          <QRCode
            value={jsonString}
            size={300}
            level="M"
            bgColor="#FFFFFF"
            fgColor="#000000"
          />
        </div>
        
        {/* Instructions */}
        <div className="text-center max-w-md">
          <p className="text-xs text-gray-500 mb-2">
            <strong>Instructions:</strong> Use any QR code scanner app to read the data above.
          </p>
          <p className="text-xs text-gray-500" dir="rtl">
            <strong>التعليمات:</strong> استخدم أي تطبيق لقراءة رمز الاستجابة السريعة لقراءة البيانات أعلاه.
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