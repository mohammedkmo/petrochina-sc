/**
 * Resources Step Component
 * 
 * Step 8: Number of vehicles and weapons, plus file uploads for resources
 */

import React from "react";
import { Label } from "@/components/ui/label";
import NumberInput from "@/components/ui/number-input";
import FileUpload from "@/components/FileUpload";
import { StepComponentProps, TableDataState, TableFileNamesState } from "@/lib/form-types";
import { TableData } from "@/lib/file-parser";

interface ResourcesStepProps extends StepComponentProps {
  tableData: TableDataState;
  tableFileNames: TableFileNamesState;
  onFileImport: (data: TableData[], fileName: string, tableType: keyof TableDataState) => void;
}

export const ResourcesStep: React.FC<ResourcesStepProps> = ({
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
          <Label htmlFor="numberOfVehicles" className="text-sm font-medium text-gray-700 mb-2 block">
            {t("form.staffLabels.numberOfVehicles")}
          </Label>
          <NumberInput
            id="numberOfVehicles"
            value={watchedFields.numberOfVehicles || "0"}
            onChange={(value) => setValue("numberOfVehicles", value)}
            placeholder={t("form.placeholders.numberOfVehicles")}
            className="h-11 text-lg font-bold rounded-lg"
            min={0}
            max={999}
          />
          {errors.numberOfVehicles && (
            <p className="text-red-600 text-xs mt-1.5">{errors.numberOfVehicles.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="numberOfWeapons" className="text-sm font-medium text-gray-700 mb-2 block">
            {t("form.staffLabels.numberOfWeapons")}
          </Label>
          <NumberInput
            id="numberOfWeapons"
            value={watchedFields.numberOfWeapons || "0"}
            onChange={(value) => setValue("numberOfWeapons", value)}
            placeholder={t("form.placeholders.numberOfWeapons")}
            className="h-11 text-lg font-bold rounded-lg"
            min={0}
            max={999}
          />
          {errors.numberOfWeapons && (
            <p className="text-red-600 text-xs mt-1.5">{errors.numberOfWeapons.message}</p>
          )}
        </div>
      </div>

      {/* File Uploads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weapons File Upload */}
        {parseInt((watchedFields.numberOfWeapons as string) || "0") > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="text-sm font-bold text-gray-900 mb-2">
              {t("form.file_upload.weapons_data")}
            </h4>
            <p className="text-xs text-gray-500 mb-3">
              {t("form.tables.weapons.import_help")}
            </p>
            <FileUpload
              onDataImport={(data, fileName) => onFileImport(data, fileName, "weapons")}
              tableType="weapons"
              importedData={tableData.weapons}
              importedFileName={tableFileNames.weapons}
            />
          </div>
        )}

        {/* Vehicles File Upload */}
        {parseInt((watchedFields.numberOfVehicles as string) || "0") > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="text-sm font-bold text-gray-900 mb-2">
              {t("form.file_upload.vehicles_data")}
            </h4>
            <p className="text-xs text-gray-500 mb-3">
              {t("form.tables.vehicles.import_help")}
            </p>
            <FileUpload
              onDataImport={(data, fileName) => onFileImport(data, fileName, "vehicles")}
              tableType="vehicles"
              importedData={tableData.vehicles}
              importedFileName={tableFileNames.vehicles}
            />
          </div>
        )}
      </div>
    </div>
  );
};

