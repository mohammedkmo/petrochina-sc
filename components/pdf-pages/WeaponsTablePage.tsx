import React from 'react';

interface Weapon {
    weaponNumber: string;
    weaponType: string;
    licenceId: string;
    workLocation: string;
}

interface Page8Props {
    data: {
        // Letter Header
        headerImageUrl?: string;

        // Weapons
        weapons?: Weapon[];

        // Manager Information
        managerName?: string;
        position?: string;
    };
}

export default function WeaponsTablePage({ data }: Page8Props) {
    const weapons = data.weapons || [];
    const rowsPerPage = 20;
    const totalPages = Math.ceil(Math.max(weapons.length, 1) / rowsPerPage);

    const renderTablePage = (pageIndex: number) => {
        const startIndex = pageIndex * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, Math.max(weapons.length, 1));
        const pageWeapons = weapons.slice(startIndex, endIndex);
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
                    <div className="" dir="rtl">الى / شعبة التصاريح الامنية - ميسان - ممثلية الحلفايا / بتروجاينا - قسم الامن</div>
                    <div className="text-base font-bold text-red-600 mt-3">
                        الاسلحة - Weapon List
                        {totalPages > 1 && (
                            <span className="text-sm text-gray-600 ml-2">
                                (Page {pageIndex + 1} of {totalPages})
                            </span>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="mb-6">
                    <table className="w-full border-collapse border border-gray-400 text-[11px]">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-400 p-2 text-center font-bold text-gray-900 w-12">SN</th>
                                <th className="border border-gray-400 p-2 text-center font-bold text-gray-900">
                                    <div className="text-gray-900">Weapon Number</div>
                                    <div className=" text-gray-700" dir="rtl">رقم السلاح</div>
                                </th>
                                <th className="border border-gray-400 p-2 text-center font-bold text-gray-900">
                                    <div className="text-gray-900">Weapon type</div>
                                    <div className=" text-gray-700" dir="rtl">نوع السلاح</div>
                                </th>
                                <th className="border border-gray-400 p-2 text-center font-bold text-gray-900">
                                    <div className="text-gray-900">Licence ID</div>
                                    <div className=" text-gray-700" dir="rtl">رقم اجازة السلاح</div>
                                </th>
                                <th className="border border-gray-400 p-2 text-center font-bold text-gray-900">
                                    <div className="text-gray-900">Work Location</div>
                                    <div className=" text-gray-700" dir="rtl">موقع العمل</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: rowsPerPage }, (_, index) => {
                                const weapon = pageWeapons[index];
                                const globalIndex = startIndex + index;
                                return (
                                    <tr key={globalIndex} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="border border-gray-400 p-2 text-center font-semibold text-gray-900">{globalIndex + 1}</td>
                                        <td className="border border-gray-400 p-2 text-gray-900">{weapon?.weaponNumber || ''}</td>
                                        <td className="border border-gray-400 p-2 text-gray-900">{weapon?.weaponType || ''}</td>
                                        <td className="border border-gray-400 p-2 text-gray-900">{weapon?.licenceId || ''}</td>
                                        <td className="border border-gray-400 p-2 text-gray-900">{weapon?.workLocation || ''}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Signature Section - Only on last page */}
                {isLastPage && (
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
