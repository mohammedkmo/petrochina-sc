import React from 'react';
import { clearanceTypeArabic } from '@/lib/clearance-type';

interface Page4Props {
    data: {
        // Letter Header
        headerImageUrl?: string;

        // Basic Information
        contractNumber?: string;

        // Company Information
        companyNameEnglish?: string;
        companyNameArabic?: string;
        contractedWithEnglish?: string;
        contractedWithArabic?: string;

        // Clearance Information
        clearanceType?: string;

        // Numbers
        numberOfIraqis?: string;
        numberOfInternationals?: string;
        numberOfVehicles?: string;
        numberOfWeapons?: string;

        // Manager Information
        managerName?: string;
        position?: string;
    };
}

export default function PledgeLetterPage({ data }: Page4Props) {
    return (
        <div className="w-[210mm] h-[297mm] mx-auto p-[20mm_15mm] relative">
            {/* Letter Header */}
            {data.headerImageUrl ? (
                <div className="w-full h-24 mx-auto mb-6 flex items-center justify-center">
                    <img
                        src={data.headerImageUrl}
                        alt="Letter Header"
                        className="w-full h-full object-cover"
                    />
                </div>
            ) : (
                <div className="w-full h-24 border border-gray-300 mx-auto mb-6 flex items-center justify-center text-sm text-gray-600">
                    LETTER HEADER
                </div>
            )}

            {/* Header */}
            <div className="text-center mb-4 text-sm font-bold leading-tight">
                <div>To / Security Clearance Office - Missan - PetroChina - Security Department</div>
                <div className="text-base font-bold underline mt-2">Sub. / Pledge letter</div>
            </div>

            {/* Content */}
            <div className="mb-4 text-xs leading-relaxed">
                We Undersigned (<span className="mx-1 font-bold">{data.companyNameEnglish || ''}</span>), contracted with (<span className="mx-1 font-bold">{data.contractedWithEnglish || ''}</span>) under Contract No. (<span className="mx-1 font-bold">{data.contractNumber || ''}</span>), would like to pledge that all the information and details provided to issue security clearance, (<span className="mx-1 font-bold">{data.clearanceType || ''}</span>) are true and correct as a requirement of the contract in the Halfaya oil field, therefore, we signed.
            </div>

            {/* Numbers Section */}
            <div className="mb-4">
                <div className="flex items-center mb-2 text-xs">
                    <span className="font-bold">Number of Local Employees:</span>
                    <div className="ml-2">{data.numberOfIraqis || ''}</div>
                </div>
                <div className="flex items-center mb-2 text-xs">
                    <span className="font-bold">Number of International Employees:</span>
                    <div className="ml-2">{data.numberOfInternationals || ''}</div>
                </div>
                <div className="flex items-center mb-2 text-xs">
                    <span className="font-bold">Number of Vehicles:</span>
                    <div className="ml-2">{data.numberOfVehicles || ''}</div>
                </div>
                <div className="flex items-center mb-2 text-xs">
                    <span className="font-bold">Number of Weapon for security companies only:</span>
                    <div className="ml-2">{data.numberOfWeapons || ''}</div>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-black my-4"></div>

            {/* Arabic Header */}
            <div className="text-center mb-4 text-sm font-bold leading-tight arabic" dir="rtl">
                <div>الى / مكتب التصاريح الامنية - ميسان / بتروجاينا - قسم الامن</div>
                <div>م / تعهد</div>
            </div>

            {/* Arabic Content */}
            <div className="mb-4 text-xs leading-relaxed arabic" dir="rtl">
                نحن الموقعون ادناه شركه (<span className="mx-1 font-bold">{data.companyNameArabic || ''}</span>) والمتعاقدة مع (<span className="mx-1 font-bold">{data.contractedWithArabic || ''}</span>) بموجب العقد (<span className="mx-1 font-bold">{data.contractNumber || ''}</span>) نتعهد بصحه المعلومات والاعداد والتفاصيل المقدمة لغرض الحصول تصريح امني (<span className="mx-1 font-bold">{clearanceTypeArabic(data.clearanceType || '')}</span>) وان جميعها صحيحه ومطابقه لاحتياجات عقد العمل في حقل الحلفايا النفطي ولاجله وقعنا .
            </div>

            {/* Arabic Numbers Section */}
            <div className="mb-4 arabic" dir="rtl">
                <div className="flex items-center mb-2 text-xs">
                    <span className="font-bold">عدد العراقيين:</span>
                    <div className="mr-2">{data.numberOfIraqis || ''}</div>
                </div>
                <div className="flex items-center mb-2 text-xs">
                    <span className="font-bold">عدد الاجانب:</span>
                    <div className="mr-2">{data.numberOfInternationals || ''}</div>
                </div>
                <div className="flex items-center mb-2 text-xs">
                    <span className="font-bold">عدد العجلات:</span>
                    <div className="mr-2">{data.numberOfVehicles || ''}</div>
                </div>
                <div className="flex items-center mb-2 text-xs">
                    <span className="font-bold">عدد الاسلحة للشركات الامنية فقط:</span>
                    <div className="mr-2">{data.numberOfWeapons || ''}</div>
                </div>
            </div>

             {/* Signature Section */}
             <div className="absolute bottom-24 left-16">
                <div className="flex items-center mb-2 text-xs">
                    <span className="font-bold">Name:</span>
                    <div className=" ml-2">{data.managerName || ''}</div>
                </div>
                <div className="flex items-center mb-2 text-xs">
                    <span className="font-bold">Position:</span>
                    <div className=" ml-2">{data.position || ''}</div>
                </div>
                <div className="flex items-center mb-2 text-xs">
                    <span className="font-bold">Signature:</span>
                    <div className=" ml-2"></div>
                </div>
            </div>
        </div>
    );
}
