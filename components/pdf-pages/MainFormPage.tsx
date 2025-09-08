import React from 'react';

interface Page1Props {
    data: {

        // Basic Information
        clearanceType?: string;
        // Company Information
        companyNameEnglish?: string;
        companyNameArabic?: string;
        contractSubjectEnglish?: string;
        contractSubjectArabic?: string;
        contractedWithEnglish?: string;
        contractedWithArabic?: string;
        contractPeriod?: string;
        contractPeriodArabic?: string;

        // Clearance Information
        authorizedPersonName?: string;
        authorizedPersonNameArabic?: string;
        fpPhone?: string;
        entryApprovalType?: string;
        duration?: string;

        // Numbers
        numberOfIraqis?: string;
        numberOfInternationals?: string;
        numberOfVehicles?: string;
        numberOfWeapons?: string;

        // Dates and Periods
        startingDate?: string;
        endDate?: string;

        // Purpose
        purposeOfEntry?: string;
        purposeOfEntryArabic?: string;
    };
}

export default function MainFormPage({ data }: Page1Props) {
    return (
        <div className="w-[210mm] h-[297mm] mx-auto p-[15mm_15mm] relative">
            <div className="border border-black">
                {/* Company Name */}
                <div className="grid grid-cols-2 gap-4 bg-gray-200 p-2 border-b border-black ">
                    <div>
                        <div className="flex items-center text-xs gap-2">
                            <span className="font-bold">Company name:</span>
                            <div className="flex-1 font-bold">{data.companyNameEnglish || ''}</div>
                        </div>
                    </div>
                    <div dir="rtl" className="arabic">
                        <div className="flex items-center text-xs gap-2">
                            <span className="font-bold">اسم الشركة:</span>
                            <div className=" flex-1 font-bold">{data.companyNameArabic || ''}</div>
                        </div>
                    </div>
                </div>

                {/* Entry Approval Type */}
                <div className="flex gap-4 border-b border-black">
                    <div className='p-2 border-r border-black flex-1'>
                        <div className=" text-xs">
                            <span className="">Entry approval type:</span>
                            <div className='flex items-center justify-between mt-2 px-2'>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 border border-black mr-1 ${data.entryApprovalType === 'New' ? 'bg-red-500' : 'bg-white'}`}></div>
                                        <span className="font-bold">New</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 border border-black mr-1 ${data.entryApprovalType === 'Re-new' ? 'bg-red-500' : 'bg-white'}`}></div>
                                        <span className="font-bold">Re-new</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 border border-black mr-1 ${data.entryApprovalType === 'Add' ? 'bg-red-500' : 'bg-white'}`}></div>
                                        <span className="font-bold">Add</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 border border-black mr-1 ${data.entryApprovalType === 'Cancel' ? 'bg-red-500' : 'bg-white'}`}></div>
                                        <span className="font-bold">Cancel</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 border border-black mr-1 ${data.entryApprovalType === 'Other' ? 'bg-red-500' : 'bg-white'}`}></div>
                                        <span className="font-bold">Other</span>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-center items-center text-xs">
                                    <span className="font-bold">Days No.</span>
                                    <div className="bg-gray-200 p-2 font-bold mt-1">{data.duration || '1-10'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div dir="rtl" className="p-2 border-black flex-1 arabic">
                        <div className=" text-xs">
                            <span className="font-bold">نوع موافقة الدخول:</span>
                            <div className='flex items-center justify-between mt-2 px-2'>
                                <div className=" space-x-2 space-y-2">
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 border border-black ml-1 ${data.entryApprovalType === 'New' ? 'bg-red-500' : 'bg-white'}`}></div>
                                        <span className="font-bold">اصدار جديد</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 border border-black ml-1 ${data.entryApprovalType === 'Re-new' ? 'bg-red-500' : 'bg-white'}`}></div>
                                        <span className="font-bold">تجديد</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 border border-black ml-1 ${data.entryApprovalType === 'Add' ? 'bg-red-500' : 'bg-white'}`}></div>
                                        <span className="font-bold">اضافة</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 border border-black ml-1 ${data.entryApprovalType === 'Cancel' ? 'bg-red-500' : 'bg-white'}`}></div>
                                        <span className="font-bold">حذف</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 border border-black ml-1 ${data.entryApprovalType === 'Other' ? 'bg-red-500' : 'bg-white'}`}></div>
                                        <span className="font-bold">أخرى</span>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-center items-center text-xs">
                                    <span className="font-bold">عدد الايام</span>
                                    <div className="bg-gray-200 p-2 font-bold mt-1">{data.duration || '1-10'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contract Subject */}
                <div className="flex gap-4 border-b border-black">
                    <div className="border-r border-black p-2 flex-1">
                        <div className=" text-xs">
                            <span className="font-bold">Contract subject:</span>
                            <div className="flex-1 mt-2">{data.contractSubjectEnglish || ''}</div>
                        </div>
                    </div>
                    <div dir="rtl" className="p-2 flex-1 arabic">
                        <div className=" text-xs">
                            <span className="font-bold">موضوع العقد:</span>
                            <div className="flex-1 mt-2">{data.contractSubjectArabic || ''}</div>
                        </div>
                    </div>
                </div>

                {/* Contracted With */}
                <div className="flex gap-4 border-b border-black">
                    <div className="border-r border-black p-2 flex-1">
                        <div className=" text-xs">
                            <span className="font-bold">Contracted with, (user department/company)</span>
                            <div className="flex-1 mt-2">{data.contractedWithEnglish || ''}</div>
                        </div>
                    </div>
                    <div dir="rtl" className="p-2 flex-1 arabic">
                        <div className=" text-xs">
                            <span className="font-bold">متعاقد مع ( القسم / الشركة )</span>
                            <div className="flex-1 mt-2">{data.contractedWithArabic || ''}</div>
                        </div>
                    </div>
                </div>

                {/* Contract Period */}
                <div className="flex gap-4  border-b border-black">
                    <div className="flex-1 border-r border-black p-2">
                        <div className="text-xs">
                            <span className="font-bold">Contract period:</span>
                        </div>
                        <div className="text-xs flex items-center gap-2">  
                            <span className="font-bold">Starting:</span>
                            <div className="flex-1">{data.startingDate || ''}</div>
                        </div>
                        <div className="text-xs flex items-center gap-2">
                            <span className="font-bold">End:</span>
                            <div className="flex-1">{data.endDate || ''}</div>
                        </div>
                    </div>
                    <div dir="rtl" className="flex-1 p-2 arabic">
                        <div className="text-xs">
                            <span className="font-bold">فترة العقد:</span>
                        </div>
                        <div className="text-xs flex items-center gap-2">
                            <span className="font-bold">بداية العقد:</span>
                            <div className="flex-1">{data.startingDate || ''}</div>
                        </div>
                        <div className="text-xs flex items-center gap-2">
                            <span className="font-bold">نهاية العقد:</span>
                            <div className="flex-1">{data.endDate || ''}</div>
                        </div>
                    </div>
                </div>

                {/* Focal Point Name */}
                <div className="flex gap-4 border-b border-black">
                    {/* Focal Point Name & Phone No. (English) */}
                    <div className="gap-4 border-r border-black p-2 flex-1 space-y-2">
                        <div>
                            <div className="flex items-start text-xs gap-2">
                                <span className="font-bold">Focal point name:</span>
                                <div className="flex-1">{data.authorizedPersonName || ''}</div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-start text-xs gap-2">
                                <span className="font-bold">FP phone No.:</span>
                                <div className="flex-1">{data.fpPhone || ''}</div>
                            </div>
                        </div>
                    </div>

                    {/* Focal Point Name & Phone No. (Arabic) */}
                    <div className="gap-4 p-2 flex-1 space-y-2">
                        <div dir="rtl" className="arabic">
                            <div className="flex items-start text-xs gap-2">
                                <span className="font-bold">اسم المخول:</span>
                                <div className="flex-1">{data.authorizedPersonNameArabic || ''}</div>
                            </div>
                        </div>
                        <div dir="rtl">
                            <div className="flex items-start text-xs gap-2">
                                <span className="font-bold">رقم هاتف المخول:</span>
                                <div className="flex-1">{data.fpPhone || ''}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Numbers Section */}
                <div className="flex gap-4 border-b border-black">
                    <div className="space-y-2 flex-1 p-2 border-r border-black">
                        <div className="text-xs">Number of Iraqis: {data.numberOfIraqis || '0'}</div>
                        <div className="text-xs">Number of Internationals: {data.numberOfInternationals || '0'}</div>
                        <div className="text-xs">Number of vehicles: {data.numberOfVehicles || '0'}</div>
                    </div>
                    <div dir="rtl" className="space-y-2 flex-1 p-2">
                        <div className="text-xs">عدد العراقيين: {data.numberOfIraqis || '0'}</div>
                        <div className="text-xs">عدد الاجانب: {data.numberOfInternationals || '0'}</div>
                        <div className="text-xs">عدد العجلات: {data.numberOfVehicles || '0'}</div>
                    </div>
                </div>

                {/* Purpose of entry - Only show when clearance type is not Permanent */}
                {data.clearanceType !== 'Permanent' && (
                    <div className="border-b border-black flex gap-4">
                        <div className="border-r border-black p-2 flex-1">
                            <div className="text-xs text-red-600 font-bold">Purpose of entry/</div>
                            <div className="text-xs min-h-12">{data.purposeOfEntry || ''}</div>
                        </div>
                        <div dir="rtl" className="p-2 flex-1 arabic">
                            <div className="text-xs text-red-600 font-bold">الغرض من الدخول\</div>
                            <div className="text-xs min-h-12">{data.purposeOfEntryArabic || ''}</div>
                        </div>
                    </div>
                )}

                {data.clearanceType === 'Permanent' ? (
                    <div>
                        <div className="border-b border-black flex gap-4">
                            <div className='border-r border-black flex-1 p-2'>
                                <div className="text-xs font-bold">PCH or Sub-Con</div>
                                <div className="text-xs">We prove the contract information and the numbers:</div>
                                <div className='space-y-2 mt-4'>
                                    <div className="flex items-center text-xs gap-2">
                                        <span className="font-bold">Name:</span>
                                        <div className="flex-1 h-4"></div>
                                    </div>
                                    <div className="flex items-center text-xs gap-2">
                                        <span className="font-bold">Position:</span>
                                        <div className="flex-1 h-4"></div>
                                    </div>
                                    <div className="flex items-center text-xs gap-2">
                                        <span className="font-bold">Department and Company:</span>
                                        <div className="flex-1 h-4"></div>
                                    </div>
                                    <div className="flex items-center text-xs gap-2">
                                        <span className="font-bold">Signature:</span>
                                        <div className="flex-1 h-4"></div>
                                    </div>
                                </div>
                            </div>
                            <div dir="rtl" className="flex-1 p-2">
                                <div className="text-xs font-bold">شركة بتروجاينا او المقاول</div>
                                <div className="text-xs">نؤيد معلومات العقد اعلاء والاعداد الواردة:</div>
                                <div className='space-y-2 mt-4'>
                                    <div className="flex items-center text-xs gap-2">
                                        <span className="font-bold">الاسم:</span>
                                        <div className="flex-1 h-4"></div>
                                    </div>
                                    <div className="flex items-center text-xs gap-2">
                                        <span className="font-bold">المنصب:</span>
                                        <div className="flex-1 h-4"></div>
                                    </div>
                                    <div className="flex items-center text-xs gap-2">
                                        <span className="font-bold">القسم اوالشركة:</span>
                                        <div className="flex-1 h-4"></div>
                                    </div>
                                    <div className="flex items-center text-xs gap-2">
                                        <span className="font-bold">التوقيع:</span>
                                        <div className="flex-1 h-4"></div>
                                    </div>
                                </div>
                            </div>
                        </div>



                        <div className="border-b border-black flex gap-4">
                            <div className='border-r border-black flex-1 p-2'>
                                <div className="text-xs font-bold">MOC-Halfaya Division</div>
                                <div className="text-xs">We prove the contract information and the numbers:</div>
                                <div className='space-y-2 mt-4'>
                                    <div className="flex items-center text-xs gap-2">
                                        <span className="font-bold">Name:</span>
                                        <div className="flex-1 h-4"></div>
                                    </div>
                                    <div className="flex items-center text-xs gap-2">
                                        <span className="font-bold">Position:</span>
                                        <div className="flex-1 h-4"></div>
                                    </div>
                                    <div className="flex items-center text-xs gap-2">
                                        <span className="font-bold">Department:</span>
                                        <div className="flex-1 h-4"></div>
                                    </div>
                                    <div className="flex items-center text-xs gap-2">
                                        <span className="font-bold">Signature:</span>
                                        <div className="flex-1 h-4"></div>
                                    </div>
                                </div>
                            </div>
                            <div dir="rtl" className="flex-1 p-2">
                                <div className="text-xs font-bold">شركة نفط ميسان – هيئة الحلفاية</div>
                                <div className="text-xs">نؤيد معلومات العقد اعلاء والاعداد الواردة:</div>
                                <div className='space-y-2 mt-4'>
                                    <div className="flex items-center text-xs gap-2">
                                        <span className="font-bold">الاسم:</span>
                                        <div className="flex-1 h-4"></div>
                                    </div>
                                    <div className="flex items-center text-xs gap-2">
                                        <span className="font-bold">المنصب:</span>
                                        <div className="flex-1 h-4"></div>
                                    </div>
                                    <div className="flex items-center text-xs gap-2">
                                        <span className="font-bold">القسم:</span>
                                        <div className="flex-1 h-4"></div>
                                    </div>
                                    <div className="flex items-center text-xs gap-2">
                                        <span className="font-bold">التوقيع:</span>
                                        <div className="flex-1 h-4"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (

                    <div className="border-b border-black flex gap-4">
                        <div className='border-r border-black flex-1 p-2'>
                            <div className="text-xs font-bold">We prove the contract information and the numbers:</div>
                            <div className='space-y-2 mt-4'>
                                <div className="flex items-center text-xs gap-2">
                                    <span className="font-bold">Name:</span>
                                    <div className="flex-1 h-4"></div>
                                </div>
                                <div className="flex items-center text-xs gap-2">
                                    <span className="font-bold">Position:</span>
                                    <div className="flex-1 h-4"></div>
                                </div>
                                <div className="flex items-center text-xs gap-2">
                                    <span className="font-bold">Department and Company:</span>
                                    <div className="flex-1 h-4"></div>
                                </div>
                                <div className="flex items-center text-xs gap-2">
                                    <span className="font-bold">Signature:</span>
                                    <div className="flex-1 h-4"></div>
                                </div>
                            </div>
                        </div>
                        <div dir="rtl" className="flex-1 p-2">
                            <div className="text-xs font-bold" dir="rtl">نؤيد معلومات العقد اعلاء والاعداد الواردة:</div>
                            <div className='space-y-2 mt-4'>
                                <div className="flex items-center text-xs gap-2">
                                    <span className="font-bold">الاسم:</span>
                                    <div className="flex-1 h-4"></div>
                                </div>
                                <div className="flex items-center text-xs gap-2">
                                    <span className="font-bold">المنصب:</span>
                                    <div className="flex-1 h-4"></div>
                                </div>
                                <div className="flex items-center text-xs gap-2">
                                    <span className="font-bold">القسم او الشركة:</span>
                                    <div className="flex-1 h-4"></div>
                                </div>
                                <div className="flex items-center text-xs gap-2">
                                    <span className="font-bold">التوقيع:</span>
                                    <div className="flex-1 h-4"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                )}

                {/* Security Department Section */}
                <div className=" p-2">
                    <div className="text-xs" dir="rtl">
                        <div className="mb-1 font-bold">تملأ من قبل قسم الأمن في شركة بتروجاينا.</div>
                        <div className='space-y-2 mt-2'>
                            <div className="flex items-center">
                                <span className="">دققت من قبل:</span>
                                <div className="flex-1 h-4"></div>
                            </div>

                            <div className="flex items-center">
                                <span className="">رقم الرساله:</span>
                                <div className="flex-1 h-4"></div>
                            </div>

                            <div className="flex items-center">
                                <span className="">التاريخ:</span>
                                <div className="flex-1 h-4"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
