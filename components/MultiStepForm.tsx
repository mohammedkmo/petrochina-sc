/**
 * Multi-Step Form Component
 * 
 * Main orchestrator component for the security clearance application form.
 * Manages form state, navigation, and step rendering.
 * 
 * @module MultiStepForm
 */

"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";

// UI Components
import { Button } from "./ui/button";
import Logo from "./logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import PDFGenerator from "./PDFGenerator";

// Form Step Components
import {
  ClearanceTypeStep,
  CompanyIdentityStep,
  CompanyContactStep,
  ContractPartnersStep,
  ContractDetailsStep,
  DurationStep,
  StaffCountsStep,
  ResourcesStep,
  PurposeStep,
  ManagementStep,
  AuthorizedPersonStep,
  AuthorizationValidityStep,
  ReviewStep,
} from "./form-steps";

// Utilities and Configurations
import { createFormSchema } from "@/lib/form-schema";
import { getSteps } from "@/lib/form-steps";
import { getFieldsToValidate, defaultFormValues } from "@/lib/form-validation";
import {
  saveFormData,
  loadFormData,
  saveTableData,
  loadTableData,
  saveTableFileNames,
  loadTableFileNames,
  saveHeaderImage,
  loadHeaderImage,
  clearAllFormData,
  type TableDataState,
  type TableFileNamesState,
} from "@/lib/form-storage";
import { TableData } from "@/lib/file-parser";
import { FormData } from "@/lib/form-types";
import Link from "next/link";

/**
 * Main Multi-Step Form Component
 */
export default function MultiStepForm() {
  // Translations and locale
  const t = useTranslations();
  const locale = useLocale();
  
  // Form configuration
  const formSchema = createFormSchema(t);
  const steps = getSteps(t);
  
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [headerImageUrl, setHeaderImageUrl] = useState<string>("");
  const [tableData, setTableData] = useState<TableDataState>({
    weapons: [],
    vehicles: [],
    international_staff: [],
    local_staff: [],
  });
  const [tableFileNames, setTableFileNames] = useState<TableFileNamesState>({
    weapons: "",
    vehicles: "",
    international_staff: "",
    local_staff: "",
  });

  /**
   * Handles file import for table data
   * Saves data to state and localStorage for persistence
   */
  const handleFileImport = (
    data: TableData[],
    fileName: string,
    tableType: keyof TableDataState
  ) => {
    const newTableData = {
      ...tableData,
      [tableType]: data,
    };
    const newTableFileNames = {
      ...tableFileNames,
      [tableType]: fileName,
    };

    setTableData(newTableData);
    setTableFileNames(newTableFileNames);

    // Persist to localStorage
    saveTableData(newTableData);
    saveTableFileNames(newTableFileNames);
  };

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  const watchedFields = watch();

  /**
   * Validates current step and moves to next step if valid
   */
  const nextStep = async () => {
    const fieldsToValidate = getFieldsToValidate(
      currentStep,
      watchedFields.clearanceType
    );

    const isValid = await trigger(fieldsToValidate as (keyof FormData)[]);
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  /**
   * Moves to previous step
   */
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const [isDragOver, setIsDragOver] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pdfData, setPdfData] = useState<Record<string, unknown> | null>(null);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  /**
   * Load saved data from localStorage on component mount
   */
  useEffect(() => {
    // Load table data
    const savedTableData = loadTableData();
    if (savedTableData) {
      setTableData(savedTableData);
    }

    // Load table file names
    const savedTableFileNames = loadTableFileNames();
    if (savedTableFileNames) {
      setTableFileNames(savedTableFileNames);
    }

    // Load header image
    const savedHeaderImage = loadHeaderImage();
    if (savedHeaderImage) {
      setHeaderImageUrl(savedHeaderImage);
      setValue("headerImageUrl", savedHeaderImage);
    }

    // Load form data
    const savedFormData = loadFormData();
    if (savedFormData) {
      Object.keys(savedFormData).forEach((key) => {
        const formKey = key as keyof FormData;
        const value = savedFormData[key];
        if (value !== undefined && value !== null) {
          setValue(formKey, value as FormData[typeof formKey]);
        }
      });
    }
  }, [setValue]);

  /**
   * Save form data to localStorage whenever it changes
   */
  useEffect(() => {
    const subscription = watch((formData) => {
      saveFormData(formData);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  /**
   * Save header image to localStorage when it changes
   */
  useEffect(() => {
    if (headerImageUrl) {
      saveHeaderImage(headerImageUrl);
    }
  }, [headerImageUrl]);

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setImageError(t("validation.fileSizeTooLarge"));
        return;
      }

      setImageError(null);
      setIsUploading(true);

      // Create image element to check dimensions
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;

        // Check if dimensions are appropriate for letterhead banner format
        // Optimal: 680x96, Maximum: 1360x192, Aspect ratio should be between 6:1 and 8:1
        const aspectRatio = width / height;

        if (width < 680 || height < 96) {
          setImageError(
            t("validation.imageDimensionsTooSmall")
          );
          setIsUploading(false);
          return;
        }

        if (width > 1360 || height > 192) {
          setImageError(
            t("validation.imageDimensionsTooLarge")
          );
          setIsUploading(false);
          return;
        }

        if (aspectRatio < 6.0 || aspectRatio > 8.0) {
          setImageError(
            t("validation.invalidAspectRatio")
          );
          setIsUploading(false);
          return;
        }

        // If all validations pass, proceed with upload
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setHeaderImageUrl(result);
          setValue("headerImageUrl", result); // Update form field
          setImageError(null); // Clear any previous errors
          setIsUploading(false);
        };

        // Image loading progress handled automatically

        reader.readAsDataURL(file);
      };

      img.onerror = () => {
        setImageError(t("validation.invalidImageFile"));
        setIsUploading(false);
      };

      // Load image to check dimensions
      img.src = URL.createObjectURL(file);
    } else {
      setImageError(t("validation.pleaseSelectValidImage"));
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageError(null); // Clear previous errors when starting new upload
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setImageError(null); // Clear previous errors when starting new upload
      handleImageUpload(files[0]);
    }
  };

  const removeImage = () => {
    setHeaderImageUrl("");
    setValue("headerImageUrl", ""); // Clear form field
    setImageError(null); // Clear any image errors
    saveHeaderImage(""); // Clear from localStorage
  };

  /**
   * Clears all saved data and resets the form
   */
  const clearAllSavedData = () => {
    clearAllFormData();
    reset(defaultFormValues);
    setTableData({
      weapons: [],
      vehicles: [],
      international_staff: [],
      local_staff: [],
    });
    setTableFileNames({
      weapons: "",
      vehicles: "",
      international_staff: "",
      local_staff: "",
    });
    setHeaderImageUrl("");
    setImageError(null);
    setCurrentStep(1);
    setShowResetConfirm(false);
  };

  /**
   * Handles reset button click - shows confirmation dialog
   */
  const handleResetClick = () => {
    setShowResetConfirm(true);
  };

  /**
   * Handles form submission
   * Prepares data for PDF generation
   */
  const onSubmit = () => {
    const formData = {
      ...watchedFields,
      headerImageUrl,
      weaponsData: tableData.weapons,
      vehiclesData: tableData.vehicles,
      internationalStaffData: tableData.international_staff,
      localStaffData: tableData.local_staff,
    };

    setPdfData(formData);
    setShowPDFPreview(true);
  };


  /**
   * Renders the content for the current step
   * Uses extracted step components where available
   */
  const renderStepContent = () => {
    // Common props for step components
    const stepProps = {
      register,
      setValue,
      watch,
      errors,
      t,
      locale,
    };

    switch (currentStep) {
      case 1:
        return <ClearanceTypeStep {...stepProps} />;

      case 2:
        return <CompanyIdentityStep {...stepProps} />;

      case 3:
        return (
          <CompanyContactStep
            {...stepProps}
            headerImageUrl={headerImageUrl}
            isDragOver={isDragOver}
            isUploading={isUploading}
            imageError={imageError}
            onFileInputChange={handleFileInputChange}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onRemoveImage={removeImage}
          />
        );

      case 4:
        return <ContractPartnersStep {...stepProps} />;

      case 5:
        return <ContractDetailsStep {...stepProps} />;

      case 6:
        return <DurationStep {...stepProps} />;

      case 7:
        return (
          <StaffCountsStep
            {...stepProps}
            tableData={tableData}
            tableFileNames={tableFileNames}
            onFileImport={handleFileImport}
          />
        );

      case 8:
        return (
          <ResourcesStep
            {...stepProps}
            tableData={tableData}
            tableFileNames={tableFileNames}
            onFileImport={handleFileImport}
          />
        );

      case 9:
        return <PurposeStep {...stepProps} />;

      case 10:
        return <ManagementStep {...stepProps} />;

      case 11:
        return <AuthorizedPersonStep {...stepProps} />;

      case 12:
        return <AuthorizationValidityStep {...stepProps} />;

      case 13:
        return <ReviewStep {...stepProps} />;

      default:
        return null;
    }
  };

  // Calculate progress percentage
  const progress = Math.round((currentStep / steps.length) * 100);

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 flex flex-col transition-colors duration-500">

      {/* Top Progress Bar (Minimal) */}
      <div className="fixed top-0 left-0 w-full z-50">
        <div className="h-1 w-full bg-gray-100">
          <div
            className="h-full bg-red-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Header (Minimal) */}
      <header className="fixed top-0 left-0 mx-auto right-0 p-6 md:px-12 md:py-5 flex justify-between items-center z-40 bg-white/95 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2.5 opacity-60 hover:opacity-100 transition-opacity">
          <Logo width={30} height={30} />
          <div className="flex flex-col -space-y-0.5">
          <p className="text-[12px] font-medium tracking-wide hidden md:inline-block text-gray-600">
            {t("common.companyName")}
          </p>
          <p className="text-[10px] font-medium tracking-wide hidden md:inline-block text-gray-600">
            {t("common.systemName")}
          </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="text-xs font-medium text-gray-500">
            {currentStep} / {steps.length}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResetClick}
            className="text-xs font-medium h-8 px-3 text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
            title={t("common.clearData")}
          >
            <RotateCcw className="w-3.5 h-3.5 rtl:ml-1.5 ltr:mr-1.5" />
            <span className="hidden sm:inline">{t("common.clearData")}</span>
          </Button>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Focused Content Area */}
      <main className="flex-1 flex flex-col justify-start md:justify-center items-center w-full max-w-2xl mx-auto px-6 md:px-8 pt-28 pb-40 md:py-20 relative">

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="w-full">
          {/* Animated Container for Questions */}
          <div key={currentStep} className="animate-in slide-in-from-bottom-8 fade-in duration-700 ease-out fill-mode-forwards">

            {/* Question Number - Minimal */}
            <div className="flex items-center gap-2 mb-6 opacity-0 animate-in slide-in-from-left-4 fade-in duration-500 delay-75 fill-mode-forwards rtl:slide-in-from-right-4">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                {String(currentStep).padStart(2, '0')}
              </span>
            </div>

            {/* Hero Question Title - Minimal */}
            <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-4 leading-tight tracking-tight">
              {steps.find((s) => s.id === currentStep)?.title}
            </h2>

            {/* Subtitle / Description - Minimal */}
            <p className="text-sm md:text-base text-gray-500 font-normal mb-12 max-w-xl leading-relaxed">
              {steps.find((s) => s.id === currentStep)?.description}
            </p>

            {/* Form Input Area */}
            <div className="mb-12">
              {renderStepContent()}
            </div>

            {/* Actions / Navigation - Minimal */}
            <div className="flex items-center gap-3 flex-wrap pt-4">
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="ghost"
                  className="text-sm font-medium h-10 px-5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                >
                  <ArrowLeft className={`w-4 h-4 rtl:ml-2 ltr:mr-2 rtl:rotate-180`} />
                  {t("form.buttons.back")}
                </Button>
              )}

              {currentStep === 13 ? (
                <Button
                  type="submit"
                  className="rounded-md text-sm font-medium h-10 px-6 bg-gray-900 hover:bg-gray-800 text-white transition-all duration-200"
                >
                  {t("form.buttons.downloadPDF")}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="rounded-md text-sm font-medium h-10 px-6 bg-gray-900 hover:bg-gray-800 text-white transition-all duration-200 group"
                >
                  {currentStep === steps.length - 1 ? t("form.buttons.review") : t("form.buttons.next")}
                  {locale === 'ar' ? (
                    <ArrowLeft className="rtl:ml-2 ltr:mr-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  ) : (
                    <ArrowRight className="rtl:ml-2 ltr:mr-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>

      </main>

      {/* Footer Branding (Minimal) */}
      <footer className="fixed bottom-0 rtl:left-0 ltr:right-0 p-8 hidden md:block z-0 pointer-events-none">
        <div className="text-[8rem] font-light text-gray-50 leading-none select-none opacity-30">
          {String(currentStep).padStart(2, '0')}
        </div>
      </footer>

      {/* PDF Preview Modal */}
      {showPDFPreview && pdfData && (
        <PDFGenerator
          data={pdfData}
          onClose={() => setShowPDFPreview(false)}
        />
      )}

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t("common.warning")}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {t("common.clearData")}? {t("common.confirm")}
            </p>
            <div className="flex items-center gap-3 justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowResetConfirm(false)}
                className="text-sm font-medium h-9 px-4 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="button"
                onClick={clearAllSavedData}
                className="text-sm font-medium h-9 px-4 bg-red-600 hover:bg-red-700 text-white"
              >
                {t("common.clearData")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
