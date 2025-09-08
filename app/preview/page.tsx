"use client";

import { useState } from "react";
import PDFTemplate from "@/components/pdf-template";

export default function PreviewPage() {
  const [formData, setFormData] = useState({
    // Letter Header
    headerImageUrl: "",
    
    // Basic Information
    contractNumber: "12345",
    contractNumberArabic: "١٢٣٤٥",
    idNumber: "987654321",
    email: "test@example.com",
    phoneNumber: "+964-123-456-789",
    
    // Company Information
    companyNameEnglish: "Test Company Ltd",
    companyNameArabic: "شركة الاختبار المحدودة",
    contractSubjectEnglish: "Software Development Services",
    contractSubjectArabic: "خدمات تطوير البرمجيات",
    contractedWithEnglish: "Ministry of Health",
    contractedWithArabic: "وزارة الصحة",
    
    // Manager Information
    managerName: "John Doe",
    position: "Project Manager",
    
    // Clearance Information
    fpNameEnglish: "John Doe",
    fpNameArabic: "أحمد محمد",
    fpPhone: "+964-123-456-789",
    clearanceType: "Temporary",
    entryApprovalType: "New",
    
    // Duration
    duration: "30",
        
    // Numbers
    numberOfIraqis: "5",
    numberOfInternationals: "3",
    numberOfVehicles: "2",
    numberOfWeapons: "0",
    
    // Dates and Periods
    fromDate: "2024-01-01",
    toDate: "2024-12-31",
    startingDate: "2024-01-01",
    endDate: "2024-12-31",
    contractPeriod: "12 months",
    contractPeriodArabic: "12 شهر",
    numberOfDays: "365",
    
    // Authorized Person
    authorizedPersonName: "John Doe",
    authorizedPersonNameArabic: "أحمد محمد",
    authorizedPersonId: "987654321",
    authorizationStartDate: "2024-01-01",
    authorizationEndDate: "2024-12-31",
    contactInfo: "test@example.com",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData(prev => ({
          ...prev,
          headerImageUrl: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">PDF Template Preview</h1>
        
        {/* Controls */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Form Data Controls</h2>
          
          {/* Letter Header Upload */}
          <div className="mb-6 p-4 border border-gray-300 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Letter Header</h3>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {formData.headerImageUrl && (
                <div className="flex items-center gap-2">
                  <img 
                    src={formData.headerImageUrl} 
                    alt="Header Preview" 
                    className="w-32 h-20 object-contain border border-gray-300 rounded"
                  />
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, headerImageUrl: "" }))}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Security Clearance type</label>
              <select
                value={formData.clearanceType}
                onChange={(e) => handleInputChange('clearanceType', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select clearance type</option>
                <option value="Temporary">Temporary</option>
                <option value="Permanent">Permanent</option>
                <option value="Emergency">Emergency</option>
                <option value="Special">Special</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contract Number</label>
              <input
                type="text"
                value={formData.contractNumber}
                onChange={(e) => handleInputChange('contractNumber', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company Name (English)</label>
              <input
                type="text"
                value={formData.companyNameEnglish}
                onChange={(e) => handleInputChange('companyNameEnglish', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company Name (Arabic)</label>
              <input
                type="text"
                value={formData.companyNameArabic}
                onChange={(e) => handleInputChange('companyNameArabic', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Manager Name</label>
              <input
                type="text"
                value={formData.managerName}
                onChange={(e) => handleInputChange('managerName', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Position</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Number of Iraqis</label>
              <input
                type="text"
                value={formData.numberOfIraqis}
                onChange={(e) => handleInputChange('numberOfIraqis', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Number of Internationals</label>
              <input
                type="text"
                value={formData.numberOfInternationals}
                onChange={(e) => handleInputChange('numberOfInternationals', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Number of Vehicles</label>
              <input
                type="text"
                value={formData.numberOfVehicles}
                onChange={(e) => handleInputChange('numberOfVehicles', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* PDF Preview */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">PDF Preview</h2>
          <div className="border border-gray-300 rounded overflow-auto max-h-[800px]">
            <PDFTemplate data={formData} />
          </div>
        </div>

        {/* Generate PDF Button */}
        <div className="mt-6 text-center">
          <button
            onClick={async () => {
              const res = await fetch("/api/generate-pdf-tsx", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: { "Content-Type": "application/json" },
              });

              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "security-clearance.pdf";
              document.body.appendChild(a);
              a.click();
              a.remove();
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate PDF
          </button>
        </div>
      </div>
    </div>
  );
}
