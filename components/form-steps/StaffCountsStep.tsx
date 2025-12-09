/**
 * Staff Counts Step Component
 * 
 * Step 7: Number of Iraqi and international staff, plus file uploads for staff data
 */

import React from "react";
import { Label } from "@/components/ui/label";
import NumberInput from "@/components/ui/number-input";
import FileUpload from "@/components/FileUpload";
import { StepComponentProps, TableDataState, TableFileNamesState } from "@/lib/form-types";
import { TableData } from "@/lib/file-parser";

interface StaffCountsStepProps extends StepComponentProps {
  tableData: TableDataState;
  tableFileNames: TableFileNamesState;
  onFileImport: (data: TableData[], fileName: string, tableType: keyof TableDataState) => void;
}

export const StaffCountsStep: React.FC<StaffCountsStepProps> = ({
  setValue,
  watch,
  errors,
  t,
  tableData,
  tableFileNames,
  onFileImport,
}) => {
  const watchedFields = watch();

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Count Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <div>
          <Label htmlFor="numberOfIraqis" className="text-sm font-medium text-gray-700 mb-2 block">
            {t("form.staffLabels.numberOfIraqis")}
          </Label>
          <NumberInput
            id="numberOfIraqis"
            value={watchedFields.numberOfIraqis || "0"}
            onChange={(value) => setValue("numberOfIraqis", value)}
            placeholder={t("form.placeholders.numberOfIraqis")}
            className="h-11 text-lg font-bold rounded-lg"
            min={0}
            max={999}
          />
          {errors.numberOfIraqis && (
            <p className="text-red-600 text-xs mt-1.5">{errors.numberOfIraqis.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="numberOfInternationals" className="text-sm font-medium text-gray-500 mb-2 block uppercase tracking-wider">
            {t("form.staffLabels.numberOfInternationals")}
          </Label>
          <NumberInput
            id="numberOfInternationals"
            value={watchedFields.numberOfInternationals || "0"}
            onChange={(value) => setValue("numberOfInternationals", value)}
            placeholder={t("form.placeholders.numberOfInternationals")}
            className="h-11 text-lg font-bold rounded-lg"
            min={0}
            max={999}
          />
          {errors.numberOfInternationals && (
            <p className="text-red-600 text-xs mt-1.5">{errors.numberOfInternationals.message}</p>
          )}
        </div>
      </div>

      {/* File Uploads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* International Staff File Upload */}
        {parseInt((watchedFields.numberOfInternationals as string) || "0") > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="text-sm font-bold text-gray-900 mb-2">
              {t("form.file_upload.international_staff_data")}
            </h4>
            <p className="text-xs text-gray-500 mb-3">
              {t("form.tables.international_staff.import_help")}
            </p>
            <FileUpload
              onDataImport={(data, fileName) => onFileImport(data, fileName, "international_staff")}
              tableType="international_staff"
              importedData={tableData.international_staff}
              importedFileName={tableFileNames.international_staff}
            />
          </div>
        )}

        {/* Local Staff File Upload */}
        {parseInt((watchedFields.numberOfIraqis as string) || "0") > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="text-sm font-bold text-gray-900 mb-2">
              {t("form.file_upload.local_staff_data")}
            </h4>
            <p className="text-xs text-gray-500 mb-3">
              {t("form.tables.local_staff.import_help")}
            </p>
            <FileUpload
              onDataImport={(data, fileName) => onFileImport(data, fileName, "local_staff")}
              tableType="local_staff"
              importedData={tableData.local_staff}
              importedFileName={tableFileNames.local_staff}
            />
          </div>
        )}
      </div>
    </div>
  );
};
