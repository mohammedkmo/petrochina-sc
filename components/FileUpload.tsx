"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileSpreadsheet, X, CheckCircle, AlertTriangle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { parseExcelFile, parseCSVFile, validateTableData, normalizeTableData, TABLE_COLUMN_MAPPINGS } from "@/lib/file-parser";

interface FileUploadProps {
  onDataImport: (data: Record<string, string | number>[], fileName: string, tableType: string) => void;
  tableType: "weapons" | "vehicles" | "international_staff" | "local_staff";
  accept?: string;
  importedData?: Record<string, string | number>[];
  importedFileName?: string;
}

interface ParsedData {
  data: Record<string, string | number>[];
  fileName: string;
  rowCount: number;
  errors: string[];
  warnings: string[];
}

const FileUpload: React.FC<FileUploadProps> = ({
  onDataImport,
  tableType,
  accept = ".xlsx,.xls,.csv",
  importedData,
  importedFileName
}) => {
  const t = useTranslations();
  const [uploadedFile, setUploadedFile] = useState<ParsedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationResults, setValidationResults] = useState<{errors: string[], warnings: string[]} | null>(null);

  // Initialize uploadedFile state when importedData is provided
  useEffect(() => {
    if (importedData && importedData.length > 0 && importedFileName) {
      setUploadedFile({
        data: importedData,
        fileName: importedFileName,
        rowCount: importedData.length,
        errors: [],
        warnings: []
      });
    }
  }, [importedData, importedFileName]);

  const downloadTemplate = () => {
    // Define the actual column structure from updated sample files
    const columnStructures = {
      weapons: ['weaponNumber', 'weaponType', 'licenceId', 'workLocation'],
      vehicles: ['vehicleNumber', 'vehicleBrand/Type', 'vehicleColor', 'workLocation'],
      international_staff: ['fullName', 'position', 'IDNumber', 'workLocation'],
      local_staff: ['fullName', 'position', 'idNumber', 'workLocation']
    };
    
    const columns = columnStructures[tableType] || [];
    
    // Create CSV header with UTF-8 BOM for proper Arabic text support
    const csvContent = columns.join(',') + '\n';
    const utf8BOM = '\uFEFF'; // UTF-8 BOM
    const csvWithBOM = utf8BOM + csvContent;
    
    // Create blob with UTF-8 encoding and BOM
    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${tableType}-template.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRequiredColumns = () => {
    const mapping = TABLE_COLUMN_MAPPINGS[tableType];
    return mapping ? mapping.required : [];
  };

  const getOptionalColumns = () => {
    const mapping = TABLE_COLUMN_MAPPINGS[tableType];
    return mapping ? mapping.optional : [];
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setIsProcessing(true);
    setError(null);
    setValidationResults(null);
    
    try {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File size must be less than 10MB");
      }
      
      let parseResult;
      
      if (file.name.endsWith('.csv')) {
        parseResult = await parseCSVFile(file);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        parseResult = await parseExcelFile(file);
      } else {
        throw new Error("Unsupported file format. Please use Excel (.xlsx, .xls) or CSV (.csv) files.");
      }
      
      // Validate the parsed data
      const validation = validateTableData(parseResult.data, tableType);
      
      if (!validation.isValid) {
        setError(`Validation failed: ${validation.errors.join(', ')}`);
        setValidationResults(validation);
        return;
      }
      
      // Normalize the data
      const normalizedData = normalizeTableData(parseResult.data, tableType);
      
      const fileData = {
        data: normalizedData,
        fileName: file.name,
        rowCount: normalizedData.length,
        errors: parseResult.errors,
        warnings: validation.warnings
      };
      
      setUploadedFile(fileData);
      setValidationResults(validation);
      onDataImport(normalizedData, file.name, tableType);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to parse file");
    } finally {
      setIsProcessing(false);
    }
  }, [onDataImport, tableType]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false
  });

  const removeFile = () => {
    setUploadedFile(null);
    setError(null);
    setValidationResults(null);
    onDataImport([], "", tableType);
  };

  const getTableTypeLabel = () => {
    switch (tableType) {
      case "weapons":
        return t("form.tables.weapons.title");
      case "vehicles":
        return t("form.tables.vehicles.title");
      case "international_staff":
        return t("form.tables.international_staff.title");
      case "local_staff":
        return t("form.tables.local_staff.title");
      default:
        return "Table";
    }
  };

  return (
    <div className="space-y-3">
      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-2">
            {isProcessing ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            ) : (
              <Upload className="h-8 w-8 text-gray-400" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {isProcessing
                  ? t("form.file_upload.processing")
                  : isDragActive
                  ? t("form.file_upload.drop_here")
                  : t("form.file_upload.drag_drop")}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Excel (.xlsx, .xls), CSV (.csv)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-3 bg-green-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{uploadedFile?.fileName}</p>
                <p className="text-xs text-gray-500">
                  {t("form.file_upload.rows_imported", { count: uploadedFile?.rowCount || 0 })}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="text-red-600 hover:text-red-700 h-6 w-6 p-0 flex-shrink-0"
              aria-label="Remove file"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          {/* Show validation warnings */}
          {validationResults && validationResults.warnings.length > 0 && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-yellow-800">Warnings:</p>
                  <ul className="text-xs text-yellow-700 mt-1 space-y-0.5">
                    {validationResults.warnings.slice(0, 2).map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* Show file parsing errors */}
          {uploadedFile && uploadedFile.errors && uploadedFile.errors.length > 0 && (
            <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded-md">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-orange-800">Issues:</p>
                  <ul className="text-xs text-orange-700 mt-1 space-y-0.5">
                    {uploadedFile.errors.slice(0, 2).map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-red-600 flex-1">{error}</p>
          </div>
        </div>
      )}
      
      {/* Download Template Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={downloadTemplate}
        className="w-full"
      >
        <Download className="w-4 h-4 rtl:ml-2 ltr:mr-2" />
        {t("form.file_upload.download_template")}
      </Button>
    </div>
  );
};

export default FileUpload;