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
    };
}

export default function PDFTemplate({ data }: PDFTemplateProps) {
    return (
        <div className="w-full bg-white text-black font-sans">
            <MainFormPage data={data} />
            <SecurityClearanceRequestPage data={data} />
            <AuthorizationLetterPage data={data} />
            <PledgeLetterPage data={data} />
            {data.clearanceType !== 'Permanent' && (
                <>
                    <LongTermPledgeLetterPage data={data} />
                    <VisaPledgeLetterPage data={data} />
                </>
            )}
            <InternationalStaffTablePage data={data} />
            <LocalStaffTablePage data={data} />
            <VehiclesTablePage data={data} />
            <WeaponsTablePage data={data} />
            <QRCodePage data={data} />
        </div>
    );
}