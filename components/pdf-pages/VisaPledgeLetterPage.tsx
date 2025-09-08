import React from 'react';

interface VisaPledgeLetterPageProps {
    data: {
        // Letter Header
        headerImageUrl?: string;
        
        // Company Information
        companyNameEnglish?: string;
        companyNameArabic?: string;
        contractedWithEnglish?: string;
        contractedWithArabic?: string;
        contractNumber?: string;
        numberOfInternationals?: string;
        
        // Signature
        managerName?: string;
        position?: string;
    };
}

export default function VisaPledgeLetterPage({ data }: VisaPledgeLetterPageProps) {
    return (
        <div className="w-[210mm] h-[297mm] mx-auto p-[20mm_15mm] break-after-page relative">
            {/* Letter Header */}
            {data.headerImageUrl ? (
                <div className="w-full h-20 mx-auto mb-4 flex items-center justify-center">
                    <img
                        src={data.headerImageUrl}
                        alt="Letter Header"
                        className="w-full h-full object-cover"
                    />
                </div>
            ) : (
                <div className="w-full h-20 border border-gray-300 mx-auto mb-4 flex items-center justify-center text-sm text-gray-600">
                    LETTER HEADER
                </div>
            )}

            {/* Header */}
            <div className="text-center mb-6 text-sm font-bold leading-tight">
                <div>To / Security Clearance Office – Missan – Halfaya Representation</div>
                <div className="text-base font-bold text-red-600 mt-3">VISA PLEDGE LETTER</div>
            </div>

            {/* English Pledge Statement */}
            <div className="mb-6">
                <div className="text-sm leading-relaxed">
                    <div className="mb-4">
                        We, (
                        <span className="mx-2 font-bold">{data.companyNameEnglish || ''}</span>
                        ), contracted with (
                        <span className="mx-2 font-bold">{data.contractedWithEnglish || ''}</span>
                        ) company under Contract No. (
                        <span className="mx-2 font-bold">{data.contractNumber || ''}</span>
                        ), pledge to provide the required visas for the (
                        <span className="mx-2 font-bold">{data.numberOfInternationals || ''}</span>
                        ) International employees within a maximum period of three days from the date of their arrival. We hope you will take the necessary measures.
                    </div>
                </div>
            </div>

            {/* Separator Line */}
            <div className="border-t border-gray-400 my-6"></div>

            {/* Arabic Header */}
            <div className="text-center mb-6 text-sm font-bold leading-tight">
                <div dir="rtl">الى / شعبة التصاريح الامنية / ميسان / ممثلية الحلفاية</div>
                <div className="text-base font-bold text-red-600 mt-3" dir="rtl">رسالة تخويل</div>
            </div>

            {/* Arabic Pledge Statement */}
            <div className="mb-8">
                <div className="text-sm leading-relaxed" dir="rtl">
                    <div className="mb-4">
                        نحن شركة (
                        <span className="mx-2 font-bold">{data.companyNameArabic || ''}</span>
                        ) المتعاقدون مع شركة (
                        <span className="mx-2 font-bold">{data.contractedWithArabic || ''}</span>
                        ) بموجب العقد رقم (
                        <span className="mx-2 font-bold">{data.contractNumber || ''}</span>
                        ) نتعهد بتقديم الفيزا المطلوبة للاجانب البالغ عددهم (
                        <span className="mx-2 font-bold">{data.numberOfInternationals || ''}</span>
                        ) وبمدة اقصاها ثلاثة ايام من تاريخ وصولهم .
                    </div>
                    <div className="mt-4">
                        راجين اتخاذ الاجرائات اللازمة مع الشكر والتقدير
                    </div>
                </div>
            </div>

             {/* Signature Section */}
             <div className="absolute bottom-24 left-12">
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
