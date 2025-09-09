import React from 'react';

interface Page3Props {
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

        // Authorized Person
        authorizedPersonName?: string;
        authorizedPersonNameArabic?: string;
        authorizedPersonId?: string;
        authorizationStartDate?: string;
        authorizationEndDate?: string;
        contactInfo?: string;

        // Manager Information
        managerName?: string;
        position?: string;
    };
}

export default function AuthorizationLetterPage({ data }: Page3Props) {
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
                <div>To / Security Clearance Office - Missan</div>
                <div>/ . PetroChina – Security Department Sub</div>
                <div className="text-base font-bold underline mt-2">AUTHRIZETION LETTER</div>
            </div>

            {/* Content */}
            <div className="mb-4 text-xs leading-relaxed">
                We, (<span className="mx-1 font-bold">{data.companyNameEnglish || ''}</span>), contracted with (<span className="mx-1 font-bold">{data.contractedWithEnglish || ''}</span>) company under Contract No. (<span className="mx-1 font-bold">{data.contractNumber || ''}</span>),<br /><br />
                Hereby authorize Mr./Ms.(<span className="mx-1 font-bold">{data.authorizedPersonName || ''}</span>), holder of ID No.(<span className="mx-1 font-bold">{data.authorizedPersonId || ''}</span>),<br /><br />
                to represent our Company before your esteemed office in all matters related to security clearances, including submitting and following up on applications and receiving approvals on our behalf.<br /><br />
                This authorization is valid from [<span className="mx-1 font-bold">{data.authorizationStartDate || ''}</span>] until [<span className="mx-1 font-bold">{data.authorizationEndDate || ''}</span>], unless revoked by our company in writing.<br /><br />
                Should you have any questions regarding this authorization, please do not hesitate to contact us at [<span className="mx-1 font-bold">{data.contactInfo || ''}</span>].
            </div>

            {/* Divider */}
            <div className="border-t border-black my-4"></div>

            {/* Arabic Header */}
            <div className="text-center mb-4 text-sm font-bold leading-tight" dir="rtl">
                <div>الى / مكتب التصاريح الامنية - ميسان / بتروجاينا - قسم الامن</div>
                <div>م / رسالة تخويل</div>
            </div>

            {/* Arabic Content */}
            <div className="mb-4 text-xs leading-relaxed arabic" dir="rtl">
                نحن شركة (<span className="mx-1 font-bold">{data.companyNameArabic || ''}</span>) المتعاقدون مع شركة (<span className="mx-1 font-bold">{data.contractedWithArabic || ''}</span>) بموجب العقد رقم (<span className="mx-1 font-bold">{data.contractNumber || ''}</span>) نخول السيد / السيدة (<span className="mx-1 font-bold">{data.authorizedPersonNameArabic || ''}</span>) حامل الهوية رقم (<span className="mx-1 font-bold">{data.authorizedPersonId || ''}</span>) بتمثيل شركتنا أمام مكتبكم الموقر في جميع الأمور المتعلقة بالتصاريح الأمنية، بما في ذلك تقديم الطلبات ومتابعتها واستلام الموافقات نيابة عنا.<br /><br />
                يسري هذا التخويل من [<span className="mx-1 font-bold" dir="ltr">{data.authorizationStartDate || ''}</span>] حتى [<span className="mx-1 font-bold" dir="ltr">{data.authorizationEndDate || ''}</span>]، ما لم تلغه شركتنا كتابيًا.<br /><br />
                لأي استفسارات بخصوص هذا التفويض، يُرجى التواصل معنا عبر [<span className="mx-1 font-bold" dir='ltr'>{data.contactInfo || ''}</span>].<br /><br />
                مع خالص التحيات،
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
