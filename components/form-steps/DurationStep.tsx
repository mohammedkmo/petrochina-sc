/**
 * Duration Step Component
 * 
 * Step 6: Allows user to set the security clearance duration in days
 * Features increment/decrement buttons and quick action buttons for common durations
 */

import React from "react";
import { Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepComponentProps } from "@/lib/form-types";

export const DurationStep: React.FC<StepComponentProps> = ({
  register,
  setValue,
  watch,
  errors,
  t,
}) => {
  const watchedFields = watch();

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Number Input with Controls */}
      <div className="flex flex-col items-center space-y-4 max-w-md mx-auto">
        <div className="w-full">
          <Label htmlFor="duration" className="text-sm font-medium text-gray-700 mb-3 block text-center">
            {t("form.labels.duration")}
          </Label>
          
          {/* Input with Increment/Decrement Buttons */}
          <div className="flex items-center justify-center gap-0 ">
            {/* Decrement Button - Left in LTR, Right in RTL */}
            <button
              type="button"
              onClick={() => {
                const current = parseInt(watchedFields.duration || "0");
                if (current > 0) {
                  setValue("duration", (current - 1).toString());
                }
              }}
              disabled={parseInt(watchedFields.duration || "0") <= 0}
              className="h-12 w-12 border border-gray-200 bg-white text-gray-400 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-400 transition-all duration-150 flex items-center justify-center ltr:rounded-l-md ltr:border-r-0 rtl:rounded-r-md rtl:border-l-0"
              aria-label="Decrease duration"
            >
              <Minus className="w-4 h-4" />
            </button>

            {/* Number Input */}
            <div className="relative flex-1 max-w-[200px]">
              <Input
                id="duration"
                type="number"
                {...register("duration")}
                min="0"
                max="999"
                placeholder="0"
                dir="ltr"
                className="h-12 text-center text-2xl font-light border-x-0 rounded-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || (!isNaN(parseInt(value)) && parseInt(value) >= 0)) {
                    setValue("duration", value);
                  }
                }}
              />
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-medium mt-1 whitespace-nowrap">
                {t("form.labels.days")}
              </div>
            </div>

            {/* Increment Button - Right in LTR, Left in RTL */}
            <button
              type="button"
              onClick={() => {
                const current = parseInt(watchedFields.duration || "0");
                setValue("duration", (current + 1).toString());
              }}
              className="h-12 w-12 border border-gray-200 bg-white text-gray-400 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 flex items-center justify-center ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0"
              aria-label="Increase duration"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center justify-center gap-2 mt-8 rtl:flex-row-reverse">
            {[7, 30, 90, 365].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setValue("duration", days.toString())}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
                  parseInt(watchedFields.duration || "0") === days
                    ? "bg-gray-900 text-white"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {days}d
              </button>
            ))}
          </div>
        </div>
      </div>

      {errors.duration && (
        <p className="text-red-600 text-xs mt-2 text-center rtl:text-right ltr:text-left">
          {errors.duration.message}
        </p>
      )}
    </div>
  );
};

