/**
 * Contract Details Step Component
 * 
 * Step 5: Contract identity, validity period, and subject
 */

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StepComponentProps } from "@/lib/form-types";

export const ContractDetailsStep: React.FC<StepComponentProps> = ({
  register,
  errors,
  t,
}) => {
  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Section 1: Contract Identity */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
          {t("form.labels.contractIdentity")}
        </h3>
        <div>
          <Label htmlFor="contractNumber" className="text-base font-medium text-gray-700 mb-2 block">
            {t("form.labels.contractNumber")}
          </Label>
          <Input
            id="contractNumber"
            {...register("contractNumber")}
            placeholder={t("form.placeholders.contractNumber")}
            className="h-12 text-base px-4 rounded-md border border-gray-200 bg-white focus:bg-white focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all font-normal placeholder:text-gray-400 w-full hover:border-gray-300"
          />
          {errors.contractNumber && (
            <p className="text-red-600 text-xs mt-1.5">{errors.contractNumber.message}</p>
          )}
        </div>
      </div>

      {/* Section 2: Validity Period */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
          {t("form.labels.contractValidity")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Start Date */}
          <div>
            <Label htmlFor="startingDate" className="text-base font-medium text-gray-700 mb-2 block">
              {t("form.labels.startingDate")}
            </Label>
            <Input
              id="startingDate"
              type="date"
              {...register("startingDate")}
              className="h-14 text-lg px-4 rounded-xl border-2 border-gray-200 bg-white focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-medium placeholder:text-gray-400 hover:border-gray-300"
            />
            {errors.startingDate && (
              <p className="text-red-600 text-xs mt-1.5">{errors.startingDate.message}</p>
            )}
          </div>

          {/* End Date */}
          <div>
            <Label htmlFor="endDate" className="text-base font-medium text-gray-700 mb-2 block">
              {t("form.labels.endDate")}
            </Label>
            <Input
              id="endDate"
              type="date"
              {...register("endDate")}
              className="h-14 text-lg px-4 rounded-xl border-2 border-gray-200 bg-white focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-medium placeholder:text-gray-400 hover:border-gray-300"
            />
            {errors.endDate && (
              <p className="text-red-600 text-xs mt-1.5">{errors.endDate.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Section 3: Subject */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
          {t("form.labels.contractSubject")}
        </h3>
        <div className="grid grid-cols-1 gap-6">
          {/* Contract Subject English */}
          <div>
            <Label htmlFor="contractSubjectEnglish" className="text-base font-medium text-gray-700 mb-2 block">
              {t("form.labels.contractSubjectEnglish")}
            </Label>
            <Textarea
              id="contractSubjectEnglish"
              {...register("contractSubjectEnglish")}
              placeholder={t("form.placeholders.contractSubjectEnglish")}
              className="min-h-[100px] text-base p-4 rounded-md border border-gray-200 bg-white focus:bg-white focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all font-normal placeholder:text-gray-400 hover:border-gray-300"
            />
            {errors.contractSubjectEnglish && (
              <p className="text-red-600 text-xs mt-1.5">{errors.contractSubjectEnglish.message}</p>
            )}
          </div>

          {/* Contract Subject Arabic */}
          <div>
            <Label htmlFor="contractSubjectArabic" className="text-base font-medium text-gray-700 mb-2 block">
              {t("form.labels.contractSubjectArabic")}
            </Label>
            <Textarea
              id="contractSubjectArabic"
              {...register("contractSubjectArabic")}
              placeholder={t("form.placeholders.contractSubjectArabic")}
              dir="rtl"
              className="min-h-[100px] text-base p-4 rounded-md border border-gray-200 bg-white focus:bg-white focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all font-normal placeholder:text-gray-400 hover:border-gray-300"
            />
            {errors.contractSubjectArabic && (
              <p className="text-red-600 text-xs mt-1.5">{errors.contractSubjectArabic.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

