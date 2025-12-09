/**
 * Purpose Step Component
 * 
 * Step 9: Purpose of entry (English and Arabic)
 * Only shown when clearance type is not "Permanent"
 */

import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StepComponentProps } from "@/lib/form-types";

export const PurposeStep: React.FC<StepComponentProps> = ({
  register,
  watch,
  errors,
  t,
}) => {
  const watchedFields = watch();

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {watchedFields.clearanceType !== "Permanent" ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div>
              <Label htmlFor="purposeOfEntry" className="text-sm font-medium text-gray-700 mb-2 block">
                {t("form.staffLabels.purposeOfEntryEnglish")}
              </Label>
              <Textarea
                id="purposeOfEntry"
                {...register("purposeOfEntry")}
                placeholder={t("form.placeholders.purposeOfEntryEnglish")}
                className="min-h-[90px] text-base p-4 rounded-md border border-gray-200 bg-white focus:bg-white focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all font-normal placeholder:text-gray-400 hover:border-gray-300"
                rows={3}
              />
              {errors.purposeOfEntry && (
                <p className="text-red-600 text-xs mt-1.5">{errors.purposeOfEntry.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="purposeOfEntryArabic" className="text-base font-medium text-gray-700 mb-2 block">
                {t("form.staffLabels.purposeOfEntryArabic")}
              </Label>
              <Textarea
                id="purposeOfEntryArabic"
                {...register("purposeOfEntryArabic")}
                placeholder={t("form.placeholders.purposeOfEntryArabic")}
                dir="rtl"
                className="min-h-[90px] text-base p-4 rounded-md border border-gray-200 bg-white focus:bg-white focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all font-normal placeholder:text-gray-400 hover:border-gray-300"
                rows={3}
              />
              {errors.purposeOfEntryArabic && (
                <p className="text-red-600 text-xs mt-1.5">{errors.purposeOfEntryArabic.message}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <p className="text-sm font-medium">{t("form.steps.purpose.notRequired")}</p>
        </div>
      )}
    </div>
  );
};

