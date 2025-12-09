/**
 * Clearance Type Step Component
 * 
 * Step 1: Allows user to select clearance type and entry approval type
 */

import React from "react";
import { CheckCircle, CheckSquare } from "lucide-react";
import { StepComponentProps } from "@/lib/form-types";

export const ClearanceTypeStep: React.FC<StepComponentProps> = ({
  register,
  setValue,
  watch,
  errors,
  t,
}) => {
  const watchedFields = watch();

  return (
    <div className="space-y-12">
      {/* Clearance Type Section */}
      <div className="space-y-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full">
          {[
            {
              value: "Permanent",
              label: t("form.clearanceType.permanent"),
              description: t("form.clearanceType.permanentDescription"),
              icon: (
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                  <CheckSquare className="w-5 h-5 text-blue-600" strokeWidth={2} />
                </div>
              ),
            },
            {
              value: "Temporary",
              label: t("form.clearanceType.temporary"),
              description: t("form.clearanceType.temporaryDescription"),
              icon: (
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mb-3 group-hover:bg-purple-100 transition-colors">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              ),
            },
            {
              value: "Urgent",
              label: t("form.clearanceType.urgent"),
              description: t("form.clearanceType.urgentDescription"),
              icon: (
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-3 group-hover:bg-orange-100 transition-colors">
                  <svg
                    className="w-5 h-5 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
              ),
            },
          ].map((type) => (
            <div
              key={type.value}
              className="relative cursor-pointer group rounded-2xl"
              onClick={() => {
                setValue(
                  "clearanceType",
                  type.value as "Permanent" | "Temporary" | "Urgent"
                );
                // Auto-set entry approval type to "New" for Temporary and Urgent
                if (type.value === "Temporary" || type.value === "Urgent") {
                  setValue("entryApprovalType", "New");
                }
              }}
            >
              <div
                className={`h-full min-h-[120px] rounded-lg bg-white px-5 py-6 transition-all duration-200 ease-out border flex flex-col items-center justify-center cursor-pointer ${
                  watchedFields.clearanceType === type.value
                    ? "border-gray-900"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div
                  className={`transition-transform duration-300 ${
                    watchedFields.clearanceType === type.value
                      ? "scale-115"
                      : "group-hover:scale-115"
                  }`}
                >
                  {type.icon}
                </div>

                <h4
                  className={`text-base font-medium mb-1.5 tracking-tight ${
                    watchedFields.clearanceType === type.value
                      ? "text-gray-900"
                      : "text-gray-700"
                  }`}
                >
                  {type.label}
                </h4>

                <p className="text-xs text-gray-500 max-w-[180px] leading-relaxed">
                  {type.description}
                </p>

                {watchedFields.clearanceType === type.value && (
                  <div className="absolute top-3 rtl:left-3 ltr:right-3">
                    <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
              </div>
              <input
                type="radio"
                value={type.value}
                {...register("clearanceType")}
                className="sr-only"
              />
            </div>
          ))}
        </div>
        {errors.clearanceType && (
          <p className="text-red-600 text-sm text-center font-medium py-2 mt-2">
            {errors.clearanceType.message}
          </p>
        )}
      </div>

      {/* Entry Approval Type Section */}
      <div className="space-y-5">
        <div className="rtl:text-right ltr:text-left">
          <h3 className="text-lg font-medium text-gray-900 mb-1.5">
            {t("form.entryApprovalType.title")}
          </h3>
          <p className="text-sm text-gray-500">
            {watchedFields.clearanceType === "Temporary" ||
            watchedFields.clearanceType === "Urgent"
              ? t("form.entryApprovalType.autoDescription")
              : t("form.entryApprovalType.description")}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            {
              value: "New",
              label: t("form.entryApprovalType.new"),
              icon: (
                <svg
                  className="w-5 h-5 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              ),
            },
            {
              value: "Re-new",
              label: t("form.entryApprovalType.renew"),
              icon: (
                <svg
                  className="w-5 h-5 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              ),
            },
            {
              value: "Add",
              label: t("form.entryApprovalType.add"),
              icon: (
                <svg
                  className="w-5 h-5 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              ),
            },
            {
              value: "Cancel",
              label: t("form.entryApprovalType.cancel"),
              icon: (
                <svg
                  className="w-5 h-5 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ),
            },
            {
              value: "Other",
              label: t("form.entryApprovalType.other"),
              icon: (
                <svg
                  className="w-5 h-5 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              ),
            },
          ].map((opt) => {
            const isDisabled =
              (watchedFields.clearanceType === "Temporary" ||
                watchedFields.clearanceType === "Urgent") &&
              opt.value !== "New";

            const isSelected = watchedFields.entryApprovalType === opt.value;

            return (
              <div
                key={opt.value}
                className={`relative transition-all duration-200 rounded-2xl ${
                  isDisabled
                    ? "cursor-not-allowed opacity-40 mix-blend-luminosity grayscale"
                    : "cursor-pointer group"
                }`}
                onClick={() => {
                  if (!isDisabled) {
                    setValue("entryApprovalType", opt.value);
                  }
                }}
              >
                <div
                  className={`
                    h-full min-h-[100px] border rounded-lg p-4 text-center transition-all duration-200 ease-out flex flex-col items-center justify-center
                    ${
                      isSelected
                        ? "border-gray-900 bg-gray-50"
                        : isDisabled
                          ? "border-gray-100 bg-gray-50/30 border-dashed opacity-40"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                    }
                  `}
                >
                  <div
                    className={`mb-3 transition-colors duration-200 transform scale-100 ${
                      isSelected
                        ? "text-gray-900"
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  >
                    {opt.icon}
                  </div>
                  <span
                    className={`text-sm font-medium tracking-tight ${
                      isSelected ? "text-gray-900" : "text-gray-700"
                    }`}
                  >
                    {opt.label}
                  </span>

                  {isSelected && (
                    <div className="absolute top-3 rtl:left-3 ltr:right-3">
                      <div className="w-4 h-4 rounded-full bg-gray-900 flex items-center justify-center">
                        <CheckCircle className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="radio"
                  value={opt.value}
                  {...register("entryApprovalType")}
                  className="sr-only"
                  disabled={isDisabled}
                />
              </div>
            );
          })}
        </div>
        {errors.entryApprovalType && (
          <p className="text-red-600 text-sm text-center font-medium py-2 mt-2">
            {errors.entryApprovalType.message}
          </p>
        )}
      </div>
    </div>
  );
};

