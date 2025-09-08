import { clearanceTypeArabic } from '@/lib/clearance-type';
import React from 'react';

interface Page2Props {
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
        duration?: string;

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

export default function SecurityClearanceRequestPage({ data }: Page2Props) {
    return (
        <div className="w-[210mm] h-[297mm] mx-auto p-[20mm_15mm] break-after-page relative">
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
                <div>To / Security Clearance Office - Missan / PetroChina - Security Department</div>
                <div>Sub: {data.clearanceType} Security Clearance Request</div>
                <div className='mt-4'>For <span className="inline-block mx-1 align-bottom">{data.duration || ''}</span> Days</div>
            </div>

            {/* Content */}
            <div className="mb-4 text-xs leading-relaxed">
                We (<span className="  mx-1 font-bold">{data.companyNameEnglish || ''}</span>), contracted with (<span className="mx-1 font-bold">{data.contractedWithEnglish || ''}</span>) under Contract No. (<span className="mx-1 font-bold">{data.contractNumber || ''}</span>), are kindly requested to issue a (<span className="mx-1 font-bold">{data.clearanceType || ''}</span>) security clearance for our Staff to guarantee access to HALFAYA Oilfield.
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
                <div dir="rtl">الى / شعبة التصاريح الامنية - ميسان / بتروجاينا - قسم الامن</div>
                <div>م / طلب اصدار تصريح امني {clearanceTypeArabic(data.clearanceType || '')}</div>
                <div className='mt-4'>لمدة <span className="inline-block mx-1 align-bottom">{data.duration || ''}</span> يوم / ايام</div>
            </div>

            {/* Arabic Content */}
            <div className="mb-4 text-xs leading-relaxed arabic" dir="rtl">
                نحن الموقعون ادناه شركه (<span className="mx-1 font-bold">{data.companyNameArabic || ''}</span>) والمتعاقدة مع (<span className="mx-1 font-bold">{data.contractedWithArabic || ''}</span>) بموجب العقد (<span className="mx-1 font-bold">{data.contractNumber || ''}</span>) يرجى التفضل بالموافقة على اصدار طلب تصريح امني لكادر شركتنا للغرض الدخول الى حقل الحفاية النفطي .. مع التقدير
            </div>

            {/* Arabic Numbers Section */}
            <div className="mb-4 arabic" dir="rtl">
                <div className="flex items-center mb-2 text-xs">
                    <span className="font-simibold">عدد العراقيين :</span>
                    <div className="mr-2">{data.numberOfIraqis || ''}</div>
                </div>
                <div className="flex items-center mb-2 text-xs">
                    <span className="font-simibold">عدد الاجانب :</span>
                    <div className="mr-2">{data.numberOfInternationals || ''}</div>
                </div>
                <div className="flex items-center mb-2 text-xs">
                    <span className="font-simibold">عدد العجلات :</span>
                    <div className="mr-2">{data.numberOfVehicles || ''}</div>
                </div>
                <div className="flex items-center mb-2 text-xs">
                    <span className="font-simibold">عدد الاسلحة للشركات الامنية فقط :</span>
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
