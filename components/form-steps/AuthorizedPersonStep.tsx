/**
 * Authorized Person Step Component
 * 
 * Step 11: Authorized person details (name in English/Arabic, phone, ID)
 */

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepComponentProps } from "@/lib/form-types";

export const AuthorizedPersonStep: React.FC<StepComponentProps> = ({
  register,
  errors,
  t,
}) => {
  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <div>
          <Label htmlFor="authorizedPersonName" className="text-base font-medium text-gray-700 mb-2 block">
            {t("form.staffLabels.authorizedPersonNameEnglish")}
          </Label>
          <Input
            id="authorizedPersonName"
            {...register("authorizedPersonName")}
            placeholder={t("form.placeholders.authorizedPersonName")}
            className="h-11 text-base px-4 rounded-md border border-gray-200 bg-white focus:bg-white focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all font-normal placeholder:text-gray-400 hover:border-gray-300"
          />
          {errors.authorizedPersonName && (
            <p className="text-red-600 text-xs mt-1.5">{errors.authorizedPersonName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="authorizedPersonNameArabic" className="text-base font-medium text-gray-700 mb-2 block">
            {t("form.staffLabels.authorizedPersonNameArabic")}
          </Label>
          <Input
            id="authorizedPersonNameArabic"
            {...register("authorizedPersonNameArabic")}
            placeholder={t("form.placeholders.authorizedPersonNameArabic")}
            dir="rtl"
            className="h-11 text-base px-4 rounded-md border border-gray-200 bg-white focus:bg-white focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all font-normal placeholder:text-gray-400 hover:border-gray-300"
          />
          {errors.authorizedPersonNameArabic && (
            <p className="text-red-600 text-xs mt-1.5">{errors.authorizedPersonNameArabic.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="fpPhone" className="text-base font-medium text-gray-700 mb-2 block">
            {t("form.staffLabels.phoneNumber")}
          </Label>
          <Input
            id="fpPhone"
            {...register("fpPhone")}
            placeholder={t("form.placeholders.phoneNumber")}
            className="h-11 text-base px-4 rounded-md border border-gray-200 bg-white focus:bg-white focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all font-normal placeholder:text-gray-400 hover:border-gray-300"
          />
          {errors.fpPhone && (
            <p className="text-red-600 text-xs mt-1.5">{errors.fpPhone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="authorizedPersonId" className="text-base font-medium text-gray-700 mb-2 block">
            {t("form.staffLabels.authorizedPersonId")}
          </Label>
          <Input
            id="authorizedPersonId"
            {...register("authorizedPersonId")}
            placeholder={t("form.placeholders.authorizedPersonId")}
            className="h-11 text-base px-4 rounded-md border border-gray-200 bg-white focus:bg-white focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all font-normal placeholder:text-gray-400 hover:border-gray-300"
          />
          {errors.authorizedPersonId && (
            <p className="text-red-600 text-xs mt-1.5">{errors.authorizedPersonId.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

