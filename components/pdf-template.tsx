import React from 'react';
import MainFormPage from './pdf-pages/MainFormPage';
import SecurityClearanceRequestPage from './pdf-pages/SecurityClearanceRequestPage';
import AuthorizationLetterPage from './pdf-pages/AuthorizationLetterPage';
import PledgeLetterPage from './pdf-pages/PledgeLetterPage';
import LongTermPledgeLetterPage from './pdf-pages/LongTermPledgeLetterPage';
import VisaPledgeLetterPage from './pdf-pages/VisaPledgeLetterPage';
import InternationalStaffTablePage from './pdf-pages/InternationalStaffTablePage';
import LocalStaffTablePage from './pdf-pages/LocalStaffTablePage';
import VehiclesTablePage from './pdf-pages/VehiclesTablePage';
import WeaponsTablePage from './pdf-pages/WeaponsTablePage';
import QRCodePage from './pdf-pages/QRCodePage';


interface PDFTemplateProps {
    data: {
        // Letter Header
        headerImageUrl?: string;

        // Basic Information
        contractNumber?: string;
        idNumber?: string;
        email?: string;
        phoneNumber?: string;

        // Company Information
        companyNameEnglish?: string;
        companyNameArabic?: string;
        contractSubjectEnglish?: string;
        contractSubjectArabic?: string;
        contractedWithEnglish?: string;
        contractedWithArabic?: string;

        // Manager Information
        managerName?: string;
        position?: string;

        // Clearance Information
        fpName?: string;
        fpPhone?: string;
        clearanceType?: string;
        entryApprovalType?: string;

        // Duration
        duration?: string;

        // Numbers
        numberOfIraqis?: string;
        numberOfInternationals?: string;
        numberOfVehicles?: string;
        numberOfWeapons?: string;

        // Dates and Periods
        fromDate?: string;
        toDate?: string;
        startingDate?: string;
        endDate?: string;
        contractPeriod?: string;
        numberOfDays?: string;

        // Authorized Person
        authorizedPersonName?: string;
        authorizedPersonNameArabic?: string;
        authorizedPersonId?: string;
        authorizationStartDate?: string;
        authorizationEndDate?: string;
        contactInfo?: string;

        // Purpose of entry/
        purposeOfEntry?: string;
        purposeOfEntryArabic?: string;

        // Staff Lists
        internationalStaff?: Array<{
            fullName: string;
            position: string;
            passportNumber: string;
            workLocation: string;
        }>;

        localStaff?: Array<{
            fullName: string;
            position: string;
            idNumber: string;
            workLocation: string;
        }>;

        vehicles?: Array<{
            vehicleNumber: string;
            vehicleType: string;
            vehicleColor: string;
            workLocation: string;
        }>;

        weapons?: Array<{
            weaponNumber: string;
            weaponType: string;
            licenceId: string;
            workLocation: string;
        }>;
        
        // Imported table data from file uploads
        weaponsData?: Array<Record<string, string | number>>;
        vehiclesData?: Array<Record<string, string | number>>;
        internationalStaffData?: Array<Record<string, string | number>>;
        localStaffData?: Array<Record<string, string | number>>;
    };
}

export default function PDFTemplate({ data }: PDFTemplateProps) {
    // Prepare data with imported table data taking priority
    const processedData = {
        ...data,
        // Use imported data if available, otherwise fall back to static data
        internationalStaff: data.internationalStaffData && data.internationalStaffData.length > 0
            ? data.internationalStaffData.map((item: Record<string, string | number>) => ({
                fullName: String(item.fullName || ''),
                position: String(item.position || ''),
                passportNumber: String(item.IDNumber || item.passportNumber || ''),
                workLocation: String(item.workLocation || '')
            }))
            : data.internationalStaff || [],
            
        localStaff: data.localStaffData && data.localStaffData.length > 0
            ? data.localStaffData.map((item: Record<string, string | number>) => ({
                fullName: String(item.name || item.fullName || ''),
                position: String(item.position || ''),
                idNumber: String(item.idNumber || ''),
                workLocation: String(item.workLocation || item.department || '')
            }))
            : data.localStaff || [],
            
        vehicles: data.vehiclesData && data.vehiclesData.length > 0
            ? data.vehiclesData.map((item: Record<string, string | number>) => ({
                vehicleNumber: String(item.vehicleNumber || ''),
                vehicleType: String(item['vehicleBrand/Type'] || item.vehicleType || ''),
                vehicleColor: String(item.vehicleColor || ''),
                workLocation: String(item.workLocation || '')
            }))
            : data.vehicles || [],
            
        weapons: data.weaponsData && data.weaponsData.length > 0
            ? data.weaponsData.map((item: Record<string, string | number>) => ({
                weaponNumber: String(item.serialNumber || item.weaponNumber || ''),
                weaponType: String(item.type || item.weaponType || ''),
                licenceId: String(item.licenceId || item.model || ''),
                workLocation: String(item.workLocation || '')
            }))
            : data.weapons || []
    };
    
    return (
        <div className="w-full bg-white text-black font-sans">
            <MainFormPage data={processedData} />
            <SecurityClearanceRequestPage data={processedData} />
            <AuthorizationLetterPage data={processedData} />
            <PledgeLetterPage data={processedData} />
            {data.clearanceType !== 'Permanent' && (
                <>
                    <LongTermPledgeLetterPage data={processedData} />
                    <VisaPledgeLetterPage data={processedData} />
                </>
            )}
            {processedData.internationalStaff.length > 0 && (
                <InternationalStaffTablePage data={processedData} />
            )}
            {processedData.localStaff.length > 0 && (
                <LocalStaffTablePage data={processedData} />
            )}
            {processedData.vehicles.length > 0 && (
                <VehiclesTablePage data={processedData} />
            )}
            {processedData.weapons.length > 0 && (
                <WeaponsTablePage data={processedData} />
            )}
            <QRCodePage data={processedData} />
        </div>
    );
}