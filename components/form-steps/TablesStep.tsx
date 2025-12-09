/**
 * Tables Step Component
 * 
 * Step 8: File uploads for weapons, vehicles, and staff data tables
 */

import React from "react";
import FileUpload from "@/components/FileUpload";
import { StepComponentProps, TableDataState, TableFileNamesState } from "@/lib/form-types";
import { TableData } from "@/lib/file-parser";

interface TablesStepProps extends StepComponentProps {
  watchedFields: Record<string, unknown>;
  tableData: TableDataState;
  tableFileNames: TableFileNamesState;
  onFileImport: (data: TableData[], fileName: string, tableType: keyof TableDataState) => void;
}

export const TablesStep: React.FC<TablesStepProps> = ({
  t,
  watchedFields,
  tableData,
  tableFileNames,
  onFileImport,
}) => {
  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* International Staff Table */}
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

      {/* Local Staff Table */}
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

      {/* Weapons Table */}
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

      {/* Vehicles Table */}
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
  );
};

