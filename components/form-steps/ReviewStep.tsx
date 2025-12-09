/**
 * Review Step Component
 * 
 * Step 13: Review all entered information before generating PDF
 */

import React from "react";
import { Badge } from "@/components/ui/badge";
import { StepComponentProps } from "@/lib/form-types";
import { clearanceTypeArabic } from "@/lib/clearance-type";

export const ReviewStep: React.FC<StepComponentProps> = ({
  watch,
  t,
}) => {
  const watchedFields = watch();

  return (
    <div className="max-w-4xl mx-auto p-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Summary Section */}
      <div className="space-y-6">
        {/* Clearance */}
        <div className="pb-4 border-b border-gray-100">
          <h3 className="font-semibold text-base text-gray-900 mb-2">
            {t("form.steps.clearance.title")}
          </h3>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
              {clearanceTypeArabic(watchedFields.clearanceType)}
            </Badge>
            <Badge variant="outline" className="text-gray-600">
              {watchedFields.entryApprovalType === "fast"
                ? t("form.options.fast")
                : t("form.options.normal")}
            </Badge>
          </div>
        </div>

        {/* Company & Contact */}
        <div className="pb-4 border-b border-gray-100">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-base text-gray-900">
              {t("form.steps.companyIdentity.title")}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <p className="rtl:text-right ltr:text-left">
              <span className="font-medium text-gray-900">
                {t("form.labels.companyNameEnglish")}:
              </span>{" "}
              {watchedFields.companyNameEnglish}
            </p>
            <p className="rtl:text-right ltr:text-left" dir="rtl">
              <span className="font-medium text-gray-900">
                {t("form.labels.companyNameArabic")}:
              </span>{" "}
              {watchedFields.companyNameArabic}
            </p>
            <p className="rtl:text-right ltr:text-left">
              <span className="font-medium text-gray-900">
                {t("form.labels.contactInfo")}:
              </span>{" "}
              {watchedFields.contactInfo}
            </p>
          </div>
        </div>

        {/* Contract */}
        <div className="pb-4 border-b border-gray-100">
          <h3 className="font-semibold text-base text-gray-900 mb-3">
            {t("form.steps.contractDetails.title")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <p className="rtl:text-right ltr:text-left">
              <span className="font-medium text-gray-900">
                {t("form.labels.contractNumber")}:
              </span>{" "}
              {watchedFields.contractNumber}
            </p>
            <p className="rtl:text-right ltr:text-left">
              <span className="font-medium text-gray-900">
                {t("form.labels.duration")}:
              </span>{" "}
              {watchedFields.duration}
            </p>
            <p className="rtl:text-right ltr:text-left">
              <span className="font-medium text-gray-900">
                {t("form.labels.startingDate")}:
              </span>{" "}
              {watchedFields.startingDate}
            </p>
            <p className="rtl:text-right ltr:text-left">
              <span className="font-medium text-gray-900">
                {t("form.labels.endDate")}:
              </span>{" "}
              {watchedFields.endDate}
            </p>
            <p className="md:col-span-2 rtl:text-right ltr:text-left">
              <span className="font-medium text-gray-900">
                {t("form.labels.contractSubjectEnglish")}:
              </span>{" "}
              {watchedFields.contractSubjectEnglish}
            </p>
          </div>
        </div>

        {/* Staff & Resources */}
        <div className="pb-4 border-b border-gray-100">
          <h3 className="font-semibold text-base text-gray-900 mb-3">
            {t("form.steps.resources.title")}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <span className="block text-xl font-bold text-gray-900">
                {watchedFields.numberOfIraqis || 0}
              </span>
              <span className="text-xs text-gray-500 uppercase">
                {t("form.staffLabels.numberOfIraqis")}
              </span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <span className="block text-xl font-bold text-gray-900">
                {watchedFields.numberOfInternationals || 0}
              </span>
              <span className="text-xs text-gray-500 uppercase">
                {t("form.staffLabels.numberOfInternationals")}
              </span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <span className="block text-xl font-bold text-gray-900">
                {watchedFields.numberOfVehicles || 0}
              </span>
              <span className="text-xs text-gray-500 uppercase">
                {t("form.staffLabels.numberOfVehicles")}
              </span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <span className="block text-xl font-bold text-gray-900">
                {watchedFields.numberOfWeapons || 0}
              </span>
              <span className="text-xs text-gray-500 uppercase">
                {t("form.staffLabels.numberOfWeapons")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Final Notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center">
        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center mb-3">
          <span className="text-lg">✓</span>
        </div>
        <h5 className="font-medium text-base text-gray-900 mb-1.5">
          {t("form.steps.review.readyToGenerate")}
        </h5>
        <p className="text-sm text-gray-600 max-w-md">
          {t("form.steps.review.allInfoReviewed")}
        </p>
      </div>
    </div>
  );
};

