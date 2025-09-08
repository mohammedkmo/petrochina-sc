import React from 'react';

interface InternationalStaff {
    fullName: string;
    position: string;
    passportNumber: string;
    workLocation: string;
}

interface Page5Props {
    data: {
        // Letter Header
        headerImageUrl?: string;

        // International Staff
        internationalStaff?: InternationalStaff[];

        // Manager Information
        managerName?: string;
        position?: string;
    };
}

export default function InternationalStaffTablePage({ data }: Page5Props) {
    const staff = data.internationalStaff || [];
    const rowsPerPage = 25;
    const totalPages = Math.ceil(Math.max(staff.length, 1) / rowsPerPage);

    const renderTablePage = (pageIndex: number) => {
        const startIndex = pageIndex * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, Math.max(staff.length, 1));
        const pageStaff = staff.slice(startIndex, endIndex);
        const isLastPage = pageIndex === totalPages - 1;

        return (
            <div key={pageIndex} className={`w-[210mm] h-[297mm] mx-auto p-[20mm_15mm] ${!isLastPage ? 'break-after-page' : ''} relative`}>
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
                <div className="text-center mb-3 text-sm font-bold leading-tight">
                    <div>To / Security Clearance Office - Missan - Halfaya Representation</div>
                    <div>PetroChina - Security Department</div>
                    <div dir="rtl">الى / شعبة التصاريح الامنية - ميسان - ممثلية الحلفايا / بتروجاينا - قسم الامن</div>
                    <div className="text-base font-bold text-red-600 mt-3">
                       <span dir='rtl'>الكادر الاجنبي</span> - International Staff
                        {totalPages > 1 && (
                            <span className="text-sm text-gray-600 ml-2">
                                (Page {pageIndex + 1} of {totalPages})
                            </span>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="mb-4">
                    <table className="w-full border-collapse border border-gray-400 text-[9px]">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-400 p-1 text-center font-bold text-gray-900 w-8">SN</th>
                                <th className="border border-gray-400 p-1 text-center font-bold text-gray-900">
                                    <div className="text-gray-900">Full name</div>
                                    <div className="text-gray-700" dir="rtl">الاسم الكامل</div>
                                </th>
                                <th className="border border-gray-400 p-1 text-center font-bold text-gray-900">
                                    <div className="text-gray-900">Position</div>
                                    <div className="text-gray-700" dir="rtl">العنوان الوظيفي</div>
                                </th>
                                <th className="border border-gray-400 p-1 text-center font-bold text-gray-900">
                                    <div className="text-gray-900">Passport Number</div>
                                    <div className="text-gray-700" dir="rtl">رقم الجواز</div>
                                </th>
                                <th className="border border-gray-400 p-1 text-center font-bold text-gray-900">
                                    <div className="text-gray-900">Work Location</div>
                                    <div className="text-gray-700" dir="rtl">موقع العمل</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: rowsPerPage }, (_, index) => {
                                const staffMember = pageStaff[index];
                                const globalIndex = startIndex + index;
                                return (
                                    <tr key={globalIndex} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="border border-gray-400 p-1 text-center font-semibold text-gray-900">{globalIndex + 1}</td>
                                        <td className="border border-gray-400 p-1 text-gray-900">{staffMember?.fullName || ''}</td>
                                        <td className="border border-gray-400 p-1 text-gray-900">{staffMember?.position || ''}</td>
                                        <td className="border border-gray-400 p-1 text-gray-900">{staffMember?.passportNumber || ''}</td>
                                        <td className="border border-gray-400 p-1 text-gray-900">{staffMember?.workLocation || ''}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Signature Section - Only on last page */}
                {isLastPage && (
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
                )}
            </div>
        );
    };

    return (
        <>
            {Array.from({ length: totalPages }, (_, pageIndex) => renderTablePage(pageIndex))}
        </>
    );
}
