"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import PDFGenerator from "./PDFGenerator";
import { Badge } from "./ui/badge";
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Building2,
  FileText,
  Users,
  CheckSquare,
  Upload,
  Eye,
  RefreshCcw,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Logo from "./logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLocale } from "next-intl";
import { clearanceTypeArabic } from "@/lib/clearance-type";
import FileUpload from "./FileUpload";
import { TableData } from "@/lib/file-parser";

// Form Schema - will be created inside component to access translations
const createFormSchema = (t: (key: string) => string) =>
  z
    .object({
      // Step 1: Clearance Type
      clearanceType: z
        .enum(["Permanent", "Temporary", "Urgent"])
        .refine((val) => val !== undefined, {
          message: t("validation.clearanceTypeRequired"),
        }),

      // Step 2: Company Information
      companyNameEnglish: z
        .string()
        .min(1, t("validation.companyNameRequired")),
      companyNameArabic: z
        .string()
        .min(1, t("validation.companyNameArabicRequired")),
      contractedWithEnglish: z
        .string()
        .min(1, t("validation.contractedWithRequired")),
      contractedWithArabic: z
        .string()
        .min(1, t("validation.contractedWithArabicRequired")),

      // Step 3: Contract Information
      contractNumber: z.string().min(1, t("validation.contractNumberRequired")),
      contractSubjectEnglish: z.string().min(1, t("validation.contractSubjectRequired")),
      contractSubjectArabic: z.string().min(1, t("validation.contractSubjectArabicRequired")),
      startingDate: z.string().min(1, t("validation.startingDateRequired")),
      endDate: z.string().min(1, t("validation.endDateRequired")),
      duration: z.string().min(1, t("validation.durationRequired")),

      // Entry approval type (optional)
      entryApprovalType: z.string().optional(),

      // Step 4: Staff Information
      numberOfIraqis: z.string().min(1, t("validation.numberOfIraqisRequired")),
      numberOfInternationals: z
        .string()
        .min(1, t("validation.numberOfInternationalsRequired")),
      numberOfVehicles: z.string().min(1, t("validation.numberOfVehiclesRequired")),
      numberOfWeapons: z.string().min(1, t("validation.numberOfWeaponsRequired")),

      // Manager Information
      managerName: z.string().min(1, t("validation.managerNameRequired")),
      position: z.string().min(1, t("validation.positionRequired")),

      // Focal Point
      fpPhone: z.string().min(1, t("validation.phoneNumberRequired")),

      // Purpose (conditional based on clearance type)
      purposeOfEntry: z.string().optional(),
      purposeOfEntryArabic: z.string().optional(),

      // Authorized Person (missing fields in template)
      authorizedPersonName: z
        .string()
        .min(1, t("validation.authorizedPersonNameRequired")),
      authorizedPersonNameArabic: z.string().min(1, t("validation.authorizedPersonNameArabicRequired")),
      authorizedPersonId: z.string().min(1, t("validation.authorizedPersonIdRequired")),
      authorizationStartDate: z.string().min(1, t("validation.startDateRequired")),
      authorizationEndDate: z.string().min(1, t("validation.endDateRequired")),
      contactInfo: z.string().min(1, t("validation.contactInfoRequired")),

      // Letter Header
      headerImageUrl: z.string().min(1, t("validation.headerImageRequired")),

      // Table Data
      weaponsData: z.array(z.any()).optional(),
      vehiclesData: z.array(z.any()).optional(),
      internationalStaffData: z.array(z.any()).optional(),
      localStaffData: z.array(z.any()).optional(),
    })
    .refine(
      (data) => {
        // Purpose of entry is required only when clearance type is not Permanent
        if (data.clearanceType !== "Permanent") {
          return data.purposeOfEntry && data.purposeOfEntry.trim().length > 0;
        }
        return true;
      },
      {
        message: t("validation.purposeOfEntryRequired"),
        path: ["purposeOfEntry"],
      }
    )
    .refine(
      (data) => {
        // Purpose of entry Arabic is required only when clearance type is not Permanent
        if (data.clearanceType !== "Permanent") {
          return (
            data.purposeOfEntryArabic &&
            data.purposeOfEntryArabic.trim().length > 0
          );
        }
        return true;
      },
      {
        message: t("validation.purposeOfEntryArabicRequired"),
        path: ["purposeOfEntryArabic"],
      }
    );

const getSteps = (t: (key: string) => string) => [
  {
    id: 1,
    title: t("form.steps.clearance.title"),
    description: t("form.steps.clearance.description"),
    icon: CheckSquare,
  },
  {
    id: 2,
    title: t("form.steps.company.title"),
    description: t("form.steps.company.description"),
    icon: Building2,
  },
  {
    id: 3,
    title: t("form.steps.contract.title"),
    description: t("form.steps.contract.description"),
    icon: FileText,
  },
  {
    id: 4,
    title: t("form.steps.staff.title"),
    description: t("form.steps.staff.description"),
    icon: Users,
  },
  {
    id: 5,
    title: t("form.steps.management.title"),
    description: t("form.steps.management.description"),
    icon: Users,
  },
  {
    id: 6,
    title: t("form.steps.authorized.title"),
    description: t("form.steps.authorized.description"),
    icon: FileText,
  },
  {
    id: 7,
    title: t("form.steps.review.title"),
    description: t("form.steps.review.description"),
    icon: CheckCircle,
  },
];

export default function MultiStepForm() {
  const t = useTranslations();
  const formSchema = createFormSchema(t);
  type FormData = z.infer<typeof formSchema>;
  const steps = getSteps(t);
  const [currentStep, setCurrentStep] = useState(1);
  const [headerImageUrl, setHeaderImageUrl] = useState<string>("");

  // Table data state
  const [tableData, setTableData] = useState<{
    weapons: TableData[];
    vehicles: TableData[];
    international_staff: TableData[];
    local_staff: TableData[];
  }>({
    weapons: [],
    vehicles: [],
    international_staff: [],
    local_staff: []
  });

  // Handler for file import
  const handleFileImport = (data: TableData[], tableType: string) => {
    const newTableData = {
      ...tableData,
      [tableType]: data
    };

    setTableData(newTableData);

    // Save to localStorage to persist across page navigation
    localStorage.setItem('tableData', JSON.stringify(newTableData));
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clearanceType: "Temporary",
      duration: "0",
      entryApprovalType: "New",
      numberOfIraqis: "0",
      numberOfInternationals: "0",
      numberOfVehicles: "0",
      numberOfWeapons: "0",
      authorizedPersonName: "",
      authorizedPersonNameArabic: "",
      authorizedPersonId: "",
      authorizationStartDate: "",
      authorizationEndDate: "",
    },
  });

  const watchedFields = watch();

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ["clearanceType", "entryApprovalType"];
        break;
      case 2:
        fieldsToValidate = [
          "companyNameEnglish",
          "companyNameArabic",
          "contactInfo",
          "headerImageUrl",
        ];
        break;
      case 3:
        fieldsToValidate = [
          "contractNumber",
          "contractSubjectEnglish",
          "contractSubjectArabic",
          "contractedWithEnglish",
          "contractedWithArabic",
          "startingDate",
          "endDate",
          "duration",
        ];
        break;
      case 4:
        fieldsToValidate = [
          "numberOfIraqis",
          "numberOfInternationals",
          "numberOfVehicles",
          "numberOfWeapons",
          "purposeOfEntry",
          "purposeOfEntryArabic",
        ];
        break;
      case 5:
        fieldsToValidate = ["managerName", "position"];
        break;
      case 6:
        fieldsToValidate = [
          "authorizedPersonName",
          "authorizedPersonNameArabic",
          "fpPhone",
          "authorizedPersonId",
          "authorizationStartDate",
          "authorizationEndDate",
        ];
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [pdfData, setPdfData] = useState<Record<string, unknown> | null>(null);
  const [showPDFPreview, setShowPDFPreview] = useState(false);

  const locale = useLocale()

  // Load all form data from localStorage on component mount
  useEffect(() => {
    // Load table data
    const savedTableData = localStorage.getItem('tableData');
    if (savedTableData) {
      try {
        const parsedData = JSON.parse(savedTableData);
        setTableData(parsedData);
        console.log('Loaded table data from localStorage:', parsedData);
      } catch (error) {
        console.error('Error parsing saved table data:', error);
      }
    }

    // Load header image
    const savedHeaderImage = localStorage.getItem('headerImageUrl');
    if (savedHeaderImage) {
      setHeaderImageUrl(savedHeaderImage);
      setValue("headerImageUrl", savedHeaderImage);
    }

    // Load form data
    const savedFormData = localStorage.getItem('formData');
    if (savedFormData) {
      try {
        const parsedFormData = JSON.parse(savedFormData);
        // Set all form values
        Object.keys(parsedFormData).forEach(key => {
          setValue(key as keyof FormData, parsedFormData[key]);
        });
        console.log('Loaded form data from localStorage:', parsedFormData);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
  }, [setValue]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const subscription = watch((formData) => {
      localStorage.setItem('formData', JSON.stringify(formData));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Save header image to localStorage when it changes
  useEffect(() => {
    if (headerImageUrl) {
      localStorage.setItem('headerImageUrl', headerImageUrl);
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

        reader.onprogress = (e) => {
          // Progress tracking removed as uploadProgress state was removed
        };

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
    localStorage.removeItem('headerImageUrl');
  };

  // Function to clear all saved data
  const clearAllSavedData = () => {
    localStorage.removeItem('formData');
    localStorage.removeItem('tableData');
    localStorage.removeItem('headerImageUrl');
    setTableData({
      weapons: [],
      vehicles: [],
      international_staff: [],
      local_staff: []
    });
    setHeaderImageUrl("");
    setValue("headerImageUrl", "");
    console.log('All saved data cleared');
  };

  const onSubmit = () => {
    // Set the form data for PDF generation
    const formData = {
      ...watchedFields,
      headerImageUrl,
      // Include table data from Excel imports
      weaponsData: tableData.weapons,
      vehiclesData: tableData.vehicles,
      internationalStaffData: tableData.international_staff,
      localStaffData: tableData.local_staff,
    };

    // Store data in a ref or state that PDFGenerator can access
    setPdfData(formData);
    setShowPDFPreview(true);
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-12 p-6">
            {/* Clearance Type Section */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    value: "Permanent",
                    label: t("form.clearanceType.permanent"),
                    description: t("form.clearanceType.permanentDescription"),
                    icon: (
                      <svg
                        className="w-8 h-8 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    ),
                  },
                  {
                    value: "Temporary",
                    label: t("form.clearanceType.temporary"),
                    description: t("form.clearanceType.temporaryDescription"),
                    icon: (
                      <svg
                        className="w-8 h-8 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ),
                  },
                  {
                    value: "Urgent",
                    label: t("form.clearanceType.urgent"),
                    description: t("form.clearanceType.urgentDescription"),
                    icon: (
                      <svg
                        className="w-8 h-8 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    ),
                  },
                ].map((type) => (
                  <div
                    key={type.value}
                    className={`relative cursor-pointer transition-all duration-200 rounded-lg ${watchedFields.clearanceType === type.value
                      ? "ring-2 ring-foreground"
                      : ""
                      }`}
                    onClick={() => {
                      setValue(
                        "clearanceType",
                        type.value as "Permanent" | "Temporary" | "Urgent"
                      );
                      // Auto-set entry approval type to "New" for Temporary and Urgent
                      if (
                        type.value === "Temporary" ||
                        type.value === "Urgent"
                      ) {
                        setValue("entryApprovalType", "New");
                      }
                    }}
                  >
                    <div
                      className={`border h-full rounded-lg p-6 text-center transition-all duration-200 ${watchedFields.clearanceType === type.value
                        ? "border-foreground bg-muted/50"
                        : "border-border hover:border-muted-foreground"
                        }`}
                    >
                      <div className="flex flex-col items-center">
                        {type.icon}
                        <h4 className="font-medium mb-2">{type.label}</h4>
                        <p className="text-sm text-muted-foreground">
                          {type.description}
                        </p>
                      </div>
                      {watchedFields.clearanceType === type.value && (
                        <div className="absolute top-3 right-3">
                          <div className="w-4 h-4 rounded-full bg-foreground"></div>
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
                <p className="text-destructive text-sm text-center">
                  {errors.clearanceType.message}
                </p>
              )}
            </div>

            {/* Entry Approval Type Section */}
            <div className="space-y-6">
              <div className="text-start">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {t("form.entryApprovalType.title")}
                </h3>
                <p className="text-sm text-muted-foreground">
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

                  return (
                    <div
                      key={opt.value}
                      className={`relative transition-all duration-200 rounded-lg ${isDisabled
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                        } ${watchedFields.entryApprovalType === opt.value
                          ? "ring-2 ring-foreground"
                          : ""
                        }`}
                      onClick={() => {
                        if (!isDisabled) {
                          setValue("entryApprovalType", opt.value);
                        }
                      }}
                    >
                      <div
                        className={`border rounded-lg p-4 text-center transition-all duration-200 ${watchedFields.entryApprovalType === opt.value
                          ? "border-foreground bg-muted/50"
                          : isDisabled
                            ? "border-border bg-muted/20"
                            : "border-border hover:border-muted-foreground"
                          }`}
                      >
                        <div className="flex flex-col items-center">
                          {opt.icon}
                          <span className="text-sm font-medium">
                            {opt.label}
                          </span>
                        </div>
                        {watchedFields.entryApprovalType === opt.value && (
                          <div className="absolute top-2 right-2">
                            <div className="w-3 h-3 rounded-full bg-foreground"></div>
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
                <p className="text-destructive text-sm text-center">
                  {errors.entryApprovalType.message}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    {t("form.companyLetterhead.title")}
                  </Label>

                  {!headerImageUrl ? (
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${isDragOver
                        ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20"
                        : "border-border hover:border-blue-300"
                        }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() =>
                        document.getElementById("headerImage")?.click()
                      }
                    >
                      <Upload
                        className={`mx-auto h-8 w-8 mb-3 ${isDragOver ? "text-blue-500" : "text-muted-foreground"
                          }`}
                      />
                      <p className="text-sm font-medium text-foreground mb-1">
                        {isDragOver
                          ? t("form.companyLetterhead.dropText")
                          : t("form.companyLetterhead.uploadText")}
                      </p>
                      <p className="text-xs text-muted-foreground mb-1">
                        {t("form.companyLetterhead.fileTypes")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("form.companyLetterhead.dimensions")}
                      </p>

                      <input
                        type="file"
                        id="headerImage"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                      <input
                        type="hidden"
                        {...register("headerImageUrl")}
                        value={headerImageUrl}
                      />

                      {isUploading && (
                        <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-sm text-foreground">
                              {t("form.companyLetterhead.uploading")}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative group rounded-lg overflow-hidden border border-border">
                      <img
                        src={headerImageUrl}
                        alt={t("form.companyLetterhead.alt")}
                        className="w-full h-32 object-cover"
                      />

                      {/* Overlay with actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-3">
                        <button
                          type="button"
                          onClick={() =>
                            document.getElementById("headerImage")?.click()
                          }
                          className="px-3 py-1.5 bg-white text-gray-900 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
                        >
                          {t("form.companyLetterhead.replace")}
                        </button>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                        >
                          {t("form.companyLetterhead.delete")}
                        </button>
                      </div>

                      <input
                        type="file"
                        id="headerImage"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                {imageError && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <p className="text-red-700 dark:text-red-300 text-sm font-medium">
                        {imageError}
                      </p>
                    </div>
                  </div>
                )}

                {errors.headerImageUrl && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <p className="text-red-700 dark:text-red-300 text-sm font-medium">
                        {errors.headerImageUrl.message}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div>
                    <Label
                      htmlFor="companyNameEnglish"
                      className="text-sm font-medium"
                    >
                      {t("form.labels.companyNameEnglish")}
                    </Label>
                    <Input
                      id="companyNameEnglish"
                      {...register("companyNameEnglish")}
                      placeholder={t("form.placeholders.companyNameEnglish")}
                      className="mt-1"
                    />
                    {errors.companyNameEnglish && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.companyNameEnglish.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="companyNameArabic"
                      className="text-sm font-medium"
                    >
                      {t("form.labels.companyNameArabic")}
                    </Label>
                    <Input
                      id="companyNameArabic"
                      {...register("companyNameArabic")}
                      placeholder={t("form.placeholders.companyNameArabic")}
                      dir="rtl"
                      className="mt-1"
                    />
                    {errors.companyNameArabic && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.companyNameArabic.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="contactInfo"
                      className="text-sm font-medium"
                    >
                      {t("form.labels.contactInfo")}
                    </Label>
                    <Input
                      id="contactInfo"
                      type="email"
                      {...register("contactInfo")}
                      placeholder={t("form.placeholders.contactInfo")}
                      className="mt-1"
                    />
                    {errors.contactInfo && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.contactInfo.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <Label
                      htmlFor="contractNumber"
                      className="text-sm font-medium"
                    >
                      {t("form.labels.contractNumber")}
                    </Label>
                    <Input
                      id="contractNumber"
                      {...register("contractNumber")}
                      placeholder={t("form.placeholders.contractNumber")}
                      className="mt-1"
                    />
                    {errors.contractNumber && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.contractNumber.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="startingDate"
                      className="text-sm font-medium"
                    >
                      {t("form.labels.startingDate")}
                    </Label>
                    <Input
                      id="startingDate"
                      type="date"
                      {...register("startingDate")}
                      className="mt-1"
                    />
                    {errors.startingDate && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.startingDate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="endDate" className="text-sm font-medium">
                      {t("form.labels.endDate")}
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      {...register("endDate")}
                      className="mt-1"
                    />
                    {errors.endDate && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.endDate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="duration" className="text-sm font-medium">
                      {t("form.labels.duration")}
                    </Label>
                    <Input
                      id="duration"
                      {...register("duration")}
                      placeholder={t("form.placeholders.duration")}
                      className="mt-1"
                    />
                    {errors.duration && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.duration.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="contractedWithEnglish"
                      className="text-sm font-medium"
                    >
                      {t("form.labels.contractedWithEnglish")}
                    </Label>
                    <Input
                      id="contractedWithEnglish"
                      {...register("contractedWithEnglish")}
                      placeholder={t("form.placeholders.contractedWithEnglish")}
                      className="mt-1"
                    />
                    {errors.contractedWithEnglish && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.contractedWithEnglish.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="contractedWithArabic"
                      className="text-sm font-medium"
                    >
                      {t("form.labels.contractedWithArabic")}
                    </Label>
                    <Input
                      id="contractedWithArabic"
                      {...register("contractedWithArabic")}
                      placeholder={t("form.placeholders.contractedWithArabic")}
                      dir="rtl"
                      className="mt-1"
                    />
                    {errors.contractedWithArabic && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.contractedWithArabic.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2 lg:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label
                          htmlFor="contractSubjectEnglish"
                          className="text-sm font-medium"
                        >
                          {t("form.labels.contractSubjectEnglish")}
                        </Label>
                        <Textarea
                          id="contractSubjectEnglish"
                          {...register("contractSubjectEnglish")}
                          placeholder={t("form.placeholders.contractSubjectEnglish")}
                          className="mt-1 min-h-[100px]"
                        />
                        {errors.contractSubjectEnglish && (
                          <p className="text-destructive text-sm mt-1">
                            {errors.contractSubjectEnglish.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="contractSubjectArabic"
                          className="text-sm font-medium"
                        >
                          {t("form.labels.contractSubjectArabic")}
                        </Label>
                        <Textarea
                          id="contractSubjectArabic"
                          {...register("contractSubjectArabic")}
                          placeholder={t("form.placeholders.contractSubjectArabic")}
                          dir="rtl"
                          className="mt-1 min-h-[100px]"
                        />
                        {errors.contractSubjectArabic && (
                          <p className="text-destructive text-sm mt-1">
                            {errors.contractSubjectArabic.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="numberOfIraqis"
                        className="text-sm font-medium"
                      >
                        {t("form.staffLabels.numberOfIraqis")}
                      </Label>
                      <Input
                        id="numberOfIraqis"
                        type="number"
                        {...register("numberOfIraqis")}
                        placeholder={t("form.placeholders.numberOfIraqis")}
                        className="mt-1"
                      />
                      {errors.numberOfIraqis && (
                        <p className="text-destructive text-sm mt-1">
                          {errors.numberOfIraqis.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label
                        htmlFor="numberOfInternationals"
                        className="text-sm font-medium"
                      >
                        {t("form.staffLabels.numberOfInternationals")}
                      </Label>
                      <Input
                        id="numberOfInternationals"
                        type="number"
                        {...register("numberOfInternationals")}
                        placeholder={t("form.placeholders.numberOfInternationals")}
                        className="mt-1"
                      />
                      {errors.numberOfInternationals && (
                        <p className="text-destructive text-sm mt-1">
                          {errors.numberOfInternationals.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label
                        htmlFor="numberOfVehicles"
                        className="text-sm font-medium"
                      >
                        {t("form.staffLabels.numberOfVehicles")}
                      </Label>
                      <Input
                        id="numberOfVehicles"
                        type="number"
                        {...register("numberOfVehicles")}
                        placeholder={t("form.placeholders.numberOfVehicles")}
                        className="mt-1"
                      />
                      {errors.numberOfVehicles && (
                        <p className="text-destructive text-sm mt-1">
                          {errors.numberOfVehicles.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label
                        htmlFor="numberOfWeapons"
                        className="text-sm font-medium"
                      >
                        {t("form.staffLabels.numberOfWeapons")}
                      </Label>
                      <Input
                        id="numberOfWeapons"
                        type="number"
                        {...register("numberOfWeapons")}
                        placeholder={t("form.placeholders.numberOfWeapons")}
                        className="mt-1"
                      />
                      {errors.numberOfWeapons && (
                        <p className="text-destructive text-sm mt-1">
                          {errors.numberOfWeapons.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Purpose of Entry - Only show when clearance type is not Permanent */}
                  {watchedFields.clearanceType !== "Permanent" && (
                    <div className="md:col-span-2 lg:col-span-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label
                            htmlFor="purposeOfEntry"
                            className="text-sm font-medium"
                          >
                            {t("form.staffLabels.purposeOfEntryEnglish")}
                          </Label>
                          <Textarea
                            id="purposeOfEntry"
                            {...register("purposeOfEntry")}
                            placeholder={t("form.placeholders.purposeOfEntryEnglish")}
                            className="mt-1 min-h-[100px]"
                          />
                          {errors.purposeOfEntry && (
                            <p className="text-destructive text-sm mt-1">
                              {errors.purposeOfEntry.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label
                            htmlFor="purposeOfEntryArabic"
                            className="text-sm font-medium"
                          >
                            {t("form.staffLabels.purposeOfEntryArabic")}
                          </Label>
                          <Textarea
                            id="purposeOfEntryArabic"
                            {...register("purposeOfEntryArabic")}
                            placeholder={t("form.placeholders.purposeOfEntryArabic")}
                            dir="rtl"
                            className="mt-1 min-h-[100px]"
                          />
                          {errors.purposeOfEntryArabic && (
                            <p className="text-destructive text-sm mt-1">
                              {errors.purposeOfEntryArabic.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* File Upload Section */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t("form.file_upload.title")}</h3>
                    <p className="text-sm text-muted-foreground mb-6">{t("form.file_upload.description")}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {parseInt(watchedFields.numberOfWeapons || '0') > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-3">{t("form.file_upload.weapons_data")}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{t("form.tables.weapons.import_help")}</p>
                        <FileUpload
                          onDataImport={(data) => handleFileImport(data, 'weapons')}
                          tableType="weapons"
                        />
                      </div>
                    )}

                    {parseInt(watchedFields.numberOfVehicles || '0') > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-3">{t("form.file_upload.vehicles_data")}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{t("form.tables.vehicles.import_help")}</p>
                        <FileUpload
                          onDataImport={(data) => handleFileImport(data, 'vehicles')}
                          tableType="vehicles"
                        />
                      </div>
                    )}

                    {parseInt(watchedFields.numberOfInternationals || '0') > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-3">{t("form.file_upload.international_staff_data")}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{t("form.tables.international_staff.import_help")}</p>
                        <FileUpload
                          onDataImport={(data) => handleFileImport(data, 'international_staff')}
                          tableType="international_staff"
                        />
                      </div>
                    )}

                    {parseInt(watchedFields.numberOfIraqis || '0') > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-3">{t("form.file_upload.local_staff_data")}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{t("form.tables.local_staff.import_help")}</p>
                        <FileUpload
                          onDataImport={(data) => handleFileImport(data, 'local_staff')}
                          tableType="local_staff"
                        />
                      </div>
                    )}
                  </div>

                  {/* Show message when no uploads are needed */}
                  {parseInt(watchedFields.numberOfWeapons || '0') === 0 &&
                    parseInt(watchedFields.numberOfVehicles || '0') === 0 &&
                    parseInt(watchedFields.numberOfInternationals || '0') === 0 &&
                    parseInt(watchedFields.numberOfIraqis || '0') === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <p className="text-sm">{t("form.file_upload.no_uploads_needed")}</p>
                        <p className="text-xs mt-1">{t("form.file_upload.set_counts_first")}</p>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="managerName"
                      className="text-sm font-medium"
                    >
                      {t("form.staffLabels.managerName")}
                    </Label>
                    <Input
                      id="managerName"
                      {...register("managerName")}
                      placeholder={t("form.placeholders.managerName")}
                      className="mt-1"
                    />
                    {errors.managerName && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.managerName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="position" className="text-sm font-medium">
                      {t("form.staffLabels.position")}
                    </Label>
                    <Input
                      id="position"
                      {...register("position")}
                      placeholder={t("form.placeholders.position")}
                      className="mt-1"
                    />
                    {errors.position && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.position.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="authorizedPersonName"
                      className="text-sm font-medium"
                    >
                      {t("form.staffLabels.authorizedPersonNameEnglish")}
                    </Label>
                    <Input
                      id="authorizedPersonName"
                      {...register("authorizedPersonName")}
                      placeholder={t("form.placeholders.authorizedPersonName")}
                      className="mt-1"
                    />
                    {errors.authorizedPersonName && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.authorizedPersonName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="authorizedPersonNameArabic"
                      className="text-sm font-medium"
                      dir="rtl"
                    >
                      {t("form.staffLabels.authorizedPersonNameArabic")}
                    </Label>
                    <Input
                      id="authorizedPersonNameArabic"
                      {...register("authorizedPersonNameArabic")}
                      placeholder={t("form.placeholders.authorizedPersonNameArabic")}
                      dir="rtl"
                      className="mt-1"
                    />
                    {errors.authorizedPersonNameArabic && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.authorizedPersonNameArabic.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="fpPhone" className="text-sm font-medium">
                      {t("form.staffLabels.phoneNumber")}
                    </Label>
                    <Input
                      id="fpPhone"
                      {...register("fpPhone")}
                      placeholder={t("form.placeholders.phoneNumber")}
                      className="mt-1"
                    />
                    {errors.fpPhone && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.fpPhone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="authorizedPersonId"
                      className="text-sm font-medium"
                    >
                      {t("form.staffLabels.idNumber")}
                    </Label>
                    <Input
                      id="authorizedPersonId"
                      {...register("authorizedPersonId")}
                      placeholder={t("form.placeholders.authorizedPersonId")}
                      className="mt-1"
                    />
                    {errors.authorizedPersonId && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.authorizedPersonId.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="authorizationStartDate"
                      className="text-sm font-medium"
                    >
                      {t("form.staffLabels.authorizationStartDate")}
                    </Label>
                    <Input
                      id="authorizationStartDate"
                      type="date"
                      {...register("authorizationStartDate")}
                      className="mt-1"
                    />
                    {errors.authorizationStartDate && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.authorizationStartDate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="authorizationEndDate"
                      className="text-sm font-medium"
                    >
                      {t("form.staffLabels.authorizationEndDate")}
                    </Label>
                    <Input
                      id="authorizationEndDate"
                      type="date"
                      {...register("authorizationEndDate")}
                      className="mt-1"
                    />
                    {errors.authorizationEndDate && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.authorizationEndDate.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 7:
        return (
          <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Summary Section */}
            <div className="space-y-6">
              {/* Clearance Type */}
              <div className="pb-4 border-b">
                <h3 className="font-semibold text-lg mb-3">{t("form.steps.review.clearanceTypeTitle")}</h3>
                <Badge variant="secondary" className="text-xs px-4 py-2">
                  {clearanceTypeArabic(watchedFields.clearanceType)}
                </Badge>
              </div>

              {/* Company Info */}
              <div className="pb-4 border-b">
                <h4 className="font-medium mb-3 text-gray-900">
                  {t("form.steps.review.companyInformation")}
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">{t("form.steps.review.company")}:</span>
                    <span className="ml-2 font-medium">
                      {watchedFields.companyNameEnglish}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">{t("form.steps.review.contractNumber")}:</span>
                    <span className="ml-2 font-medium">
                      {watchedFields.contractNumber}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-600">{t("form.steps.review.iraqis")}:</span>
                    <span className="ml-2 font-medium">
                      {watchedFields.numberOfIraqis}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">{t("form.steps.review.internationals")}:</span>
                    <span className="ml-2 font-medium">
                      {watchedFields.numberOfInternationals}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">{t("form.steps.review.vehicles")}:</span>
                    <span className="ml-2 font-medium">
                      {watchedFields.numberOfVehicles}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">{t("form.steps.review.weapons")}:</span>
                    <span className="ml-2 font-medium">
                      {watchedFields.numberOfWeapons}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Notice */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">
                    {t("form.steps.review.readyToGenerate")}
                  </h5>
                  <p className="text-sm text-gray-700">
                    {t("form.steps.review.allInfoReviewed")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#c6e0ff] to-[#ecf5ff] py-10 flex items-center justify-center">
      <div className="mx-auto w-6xl px-4 h-[90vh]">
        <div className="rounded-2xl bg-white h-full flex flex-col">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-blue-100 px-4 py-3 md:px-6 flex-shrink-0">
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
            >
              <Logo width={25} height={25} />
              <h1 className="font-bold">{t("common.companyName")} - {t("common.department")} / {t("common.title")}</h1>
            </button>

            <LanguageSwitcher />
          </div>

          {/* Main Content */}
          <div className="flex flex-1 min-h-0">
            {/* Left Rail - Vertical Stepper */}
            <aside className="border-e border-blue-100 p-8  overflow-y-auto">
              <ol className="relative space-y-6">
                {steps.map((step, idx) => {
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;
                  const isNext = currentStep < step.id;
                  return (
                    <li
                      key={step.id}
                      className="relative flex items-start gap-3"
                    >
                      {/* Enhanced Connector Line */}
                      {idx !== steps.length - 1 && (
                        <div className="absolute start-[11px] top-6 w-0.5 h-16">
                          <div
                            className={`w-full h-full transition-all duration-300 ${isCompleted
                              ? "bg-red-500"
                              : isActive
                                ? "bg-gradient-to-b from-red-500 to-border"
                                : "bg-border"
                              }`}
                          />
                        </div>
                      )}

                      {/* Enhanced Bullet */}
                      <div className="relative z-10">
                        <span
                          className={`flex h-6 w-6 shrink-0 mt-0.5 items-center justify-center rounded-full border-2 text-xs font-medium transition-all duration-300 ${isCompleted
                            ? "bg-red-500 text-primary-foreground border-white ring-2 ring-red-500"
                            : isActive
                              ? "border-red-500 text-red-500 bg-red-50 ring-2 ring-red-500/20"
                              : isNext
                                ? "border-border text-muted-foreground bg-background hover:border-primary/50 hover:text-primary/70 transition-colors"
                                : "border-muted text-muted-foreground bg-red-500/30"
                            }`}
                        >
                          {isCompleted ? (
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            step.id
                          )}
                        </span>
                      </div>

                      {/* Enhanced Labels */}
                      <div className="flex-1 min-w-0 pt-1">
                        <div
                          className={`text-sm font-semibold transition-colors duration-200 ${isActive
                            ? "text-foreground"
                            : isCompleted
                              ? "text-foreground/90"
                              : "text-muted-foreground"
                            }`}
                        >
                          {step.title}
                        </div>
                        <div
                          className={`text-xs mt-1 transition-colors duration-200 ${isActive
                            ? "text-muted-foreground"
                            : "text-muted-foreground/70"
                            }`}
                        >
                          {step.description}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </aside>

            {/* Right - Form Area */}
            <section className="flex flex-col flex-1 min-h-0">
              <header className="flex-shrink-0 p-6">
                <h1 className="text-xl font-semibold tracking-tight">
                  {steps.find((s) => s.id === currentStep)?.title}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {steps.find((s) => s.id === currentStep)?.description}
                </p>
              </header>

              <div className="flex flex-col flex-1 min-h-0 relative">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  autoComplete="off"
                  className="flex-1 overflow-y-auto pb-24"
                >
                  <div key={currentStep} className="">
                    {renderStepContent()}
                  </div>
                </form>

                {/* Sticky Navigation with Backdrop Blur */}
                <div className="absolute bottom-0 left-0 right-0 bg-background/80 rounded-b-lg backdrop-blur-sm border-t border-blue-100">
                  <div className="p-6 py-4 flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="flex items-center gap-2"
                    >
                      {locale === "ar" ? (
                        <ArrowRight className="h-4 w-4" />
                      ) : (
                        <ArrowLeft className="h-4 w-4" />
                      )}
                      {t("common.back")}
                    </Button>

                    {currentStep < steps.length ? (
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={clearAllSavedData}
                        >
                          <RefreshCcw className="h-4 w-4" />
                          {t("common.clearData")}
                        </Button>
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="flex items-center gap-2"
                        >
                          {t("common.continue")}
                          {locale === 'ar' ? (
                            <ArrowLeft className="h-4 w-4" />
                          ) : (
                            <ArrowRight className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={clearAllSavedData}
                        >
                          <RefreshCcw className="h-4 w-4" />
                          {t("common.clearData")}
                        </Button>
                        <Button
                          type="submit"
                          onClick={(e) => {
                            console.log("Download PDF button clicked!");
                            console.log("Current form errors:", errors);
                            handleSubmit(onSubmit)(e);
                          }}
                          className="flex items-center gap-2 min-w-[140px]"
                        >
                          <Eye className="h-4 w-4" />
                          {t("common.downloadPdf")}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {showPDFPreview && pdfData && (
        <PDFGenerator
          data={pdfData}
          onClose={() => setShowPDFPreview(false)}
        />
      )}
    </div>
  );
}
