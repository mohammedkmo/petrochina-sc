/**
 * Management Step Component
 * 
 * Step 10: Manager name and position
 */

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepComponentProps } from "@/lib/form-types";

export const ManagementStep: React.FC<StepComponentProps> = ({
  register,
  errors,
  t,
}) => {
  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <div>
          <Label htmlFor="managerName" className="text-sm font-medium text-gray-700 mb-2 block">
            {t("form.staffLabels.managerName")}
          </Label>
          <Input
            id="managerName"
            {...register("managerName")}
            placeholder={t("form.placeholders.managerName")}
            className="h-11 text-base px-4 rounded-md border border-gray-200 bg-white focus:bg-white focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all font-normal placeholder:text-gray-400 hover:border-gray-300"
          />
          {errors.managerName && (
            <p className="text-red-600 text-xs mt-1.5">{errors.managerName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="position" className="text-base font-medium text-gray-700 mb-2 block">
            {t("form.staffLabels.position")}
          </Label>
          <Input
            id="position"
            {...register("position")}
            placeholder={t("form.placeholders.position")}
            className="h-11 text-base px-4 rounded-md border border-gray-200 bg-white focus:bg-white focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all font-normal placeholder:text-gray-400 hover:border-gray-300"
          />
          {errors.position && (
            <p className="text-red-600 text-xs mt-1.5">{errors.position.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

