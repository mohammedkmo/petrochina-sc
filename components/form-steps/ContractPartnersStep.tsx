/**
 * Contract Partners Step Component
 * 
 * Step 4: Contracted with information in English and Arabic
 */

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepComponentProps } from "@/lib/form-types";

export const ContractPartnersStep: React.FC<StepComponentProps> = ({
  register,
  errors,
  t,
}) => {
  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-6">
        <div>
          <Label htmlFor="contractedWithEnglish" className="text-base font-medium text-gray-700 mb-2 block">
            {t("form.labels.contractedWithEnglish")}
          </Label>
          <Input
            id="contractedWithEnglish"
            {...register("contractedWithEnglish")}
            placeholder={t("form.placeholders.contractedWithEnglish")}
            className="h-11 text-base px-4 rounded-md border border-gray-200 bg-white focus:bg-white focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all font-normal placeholder:text-gray-400 hover:border-gray-300"
          />
          {errors.contractedWithEnglish && (
            <p className="text-red-600 text-xs mt-1.5">{errors.contractedWithEnglish.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="contractedWithArabic" className="text-base font-medium text-gray-700 mb-2 block">
            {t("form.labels.contractedWithArabic")}
          </Label>
          <Input
            id="contractedWithArabic"
            {...register("contractedWithArabic")}
            placeholder={t("form.placeholders.contractedWithArabic")}
            dir="rtl"
            className="h-11 text-base px-4 rounded-md border border-gray-200 bg-white focus:bg-white focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all font-normal placeholder:text-gray-400 hover:border-gray-300"
          />
          {errors.contractedWithArabic && (
            <p className="text-red-600 text-xs mt-1.5">{errors.contractedWithArabic.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

