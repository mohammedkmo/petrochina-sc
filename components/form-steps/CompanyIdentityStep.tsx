/**
 * Company Identity Step Component
 * 
 * Step 2: Company name in English and Arabic
 */

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepComponentProps } from "@/lib/form-types";

export const CompanyIdentityStep: React.FC<StepComponentProps> = ({
  register,
  errors,
  t,
}) => {
  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="companyNameEnglish" className="text-sm font-medium text-gray-700">
            {t("form.labels.companyNameEnglish")}
          </Label>
          <Input
            id="companyNameEnglish"
            {...register("companyNameEnglish")}
            placeholder={t("form.placeholders.companyNameEnglish")}
            className="h-11 text-base px-4 rounded-md border border-gray-200 bg-white focus:bg-white focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all font-normal placeholder:text-gray-400 hover:border-gray-300"
          />
          {errors.companyNameEnglish && (
            <p className="text-red-600 text-xs mt-1.5">
              {errors.companyNameEnglish.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyNameArabic" className="text-sm font-medium text-gray-700">
            {t("form.labels.companyNameArabic")}
          </Label>
          <Input
            id="companyNameArabic"
            {...register("companyNameArabic")}
            placeholder={t("form.placeholders.companyNameArabic")}
            dir="rtl"
            className="h-11 text-base px-4 rounded-md border border-gray-200 bg-white focus:bg-white focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all font-normal placeholder:text-gray-400 hover:border-gray-300"
          />
          {errors.companyNameArabic && (
            <p className="text-red-600 text-xs mt-1.5">
              {errors.companyNameArabic.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

