"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
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
  Download,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Phone } from "lucide-react";
import Logo from "./logo";

// Form Schema
const formSchema = z.object({
  // Step 1: Clearance Type
  clearanceType: z
    .enum(["Permanent", "Temporary", "Urgent"])
    .refine((val) => val !== undefined, {
      message: "Please select a clearance type",
    }),

  // Step 2: Company Information
  companyNameEnglish: z.string().min(1, "Company name is required"),
  companyNameArabic: z.string().min(1, "اسم الشركة مطلوب"),
  contractedWithEnglish: z.string().min(1, "Contracted with is required"),
  contractedWithArabic: z.string().min(1, "المتعاقد مع مطلوب"),

  // Step 3: Contract Information
  contractNumber: z.string().min(1, "Contract number is required"),
  contractSubjectEnglish: z.string().min(1, "Contract subject is required"),
  contractSubjectArabic: z.string().min(1, "موضوع العقد مطلوب"),
  startingDate: z.string().min(1, "Starting date is required"),
  endDate: z.string().min(1, "End date is required"),
  duration: z.string().min(1, "Duration is required"),

  // Entry approval type (optional)
  entryApprovalType: z.string().optional(),

  // Step 4: Staff Information
  numberOfIraqis: z.string().min(1, "Number of Iraqis is required"),
  numberOfInternationals: z
    .string()
    .min(1, "Number of Internationals is required"),
  numberOfVehicles: z.string().min(1, "Number of vehicles is required"),
  numberOfWeapons: z.string().min(1, "Number of weapons is required"),

  // Manager Information
  managerName: z.string().min(1, "Manager name is required"),
  position: z.string().min(1, "Position is required"),

  // Focal Point
  fpPhone: z.string().min(1, "Phone number is required"),

  // Purpose (conditional based on clearance type)
  purposeOfEntry: z.string().optional(),
  purposeOfEntryArabic: z.string().optional(),

  // Authorized Person (missing fields in template)
  authorizedPersonName: z.string().min(1, "Authorized person name is required"),
  authorizedPersonNameArabic: z.string().min(1, "اسم الشخص المخول مطلوب"),
  authorizedPersonId: z.string().min(1, "Authorized person ID is required"),
  authorizationStartDate: z.string().min(1, "Start date is required"),
  authorizationEndDate: z.string().min(1, "End date is required"),
  contactInfo: z.string().min(1, "Contact info is required"),

  // Letter Header
  headerImageUrl: z.string().optional(),
}).refine((data) => {
  // Purpose of entry is required only when clearance type is not Permanent
  if (data.clearanceType !== "Permanent") {
    return data.purposeOfEntry && data.purposeOfEntry.trim().length > 0;
  }
  return true;
}, {
  message: "Purpose of entry is required",
  path: ["purposeOfEntry"]
}).refine((data) => {
  // Purpose of entry Arabic is required only when clearance type is not Permanent
  if (data.clearanceType !== "Permanent") {
    return data.purposeOfEntryArabic && data.purposeOfEntryArabic.trim().length > 0;
  }
  return true;
}, {
  message: "الغرض من الدخول مطلوب",
  path: ["purposeOfEntryArabic"]
});

type FormData = z.infer<typeof formSchema>;

const steps = [
  {
    id: 1,
    title: "Clearance & Approval Type",
    description: "Choose clearance type and entry approval",
    icon: CheckSquare,
  },
  {
    id: 2,
    title: "Company Info",
    description: "Enter company information and contact details",
    icon: Building2,
  },
  {
    id: 3,
    title: "Contract Details",
    description: "Contract information, contractor details and duration",
    icon: FileText,
  },
  {
    id: 4,
    title: "Staff & Purpose",
    description: "Number of staff, resources and purpose of entry",
    icon: Users,
  },
  {
    id: 5,
    title: "Management Contacts",
    description: "Management contact information",
    icon: Users,
  },
  {
    id: 6,
    title: "Authorized Person",
    description: "Authorization details and contact information",
    icon: FileText,
  },
  {
    id: 7,
    title: "Review & Submit",
    description: "Review and submit your application",
    icon: CheckCircle,
  },
];

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [headerImageUrl, setHeaderImageUrl] = useState<string>("");

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setImageError("File size must be less than 10MB");
        return;
      }

      setImageError(null);
      setIsUploading(true);
      setUploadProgress(0);

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
            "Image dimensions too small. Minimum size: 680x96 pixels for letterhead banner"
          );
          setIsUploading(false);
          return;
        }

        if (width > 1360 || height > 192) {
          setImageError(
            "Image dimensions too large. Maximum size: 1360x192 pixels"
          );
          setIsUploading(false);
          return;
        }

        if (aspectRatio < 6.0 || aspectRatio > 8.0) {
          setImageError(
            "Invalid aspect ratio. Letterhead must be a wide banner format (width should be 6-8 times the height)"
          );
          setIsUploading(false);
          return;
        }

        // If all validations pass, proceed with upload
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setHeaderImageUrl(result);
          setImageError(null); // Clear any previous errors
          setIsUploading(false);
          setUploadProgress(100);
        };

        reader.onprogress = (e) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            setUploadProgress(progress);
          }
        };

        reader.readAsDataURL(file);
      };

      img.onerror = () => {
        setImageError("Invalid image file. Please select a valid image.");
        setIsUploading(false);
      };

      // Load image to check dimensions
      img.src = URL.createObjectURL(file);
    } else {
      setImageError("Please select a valid image file (PNG, JPG, GIF)");
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
    setUploadProgress(0);
  };

  const previewPDF = async () => {
    const formData = {
      ...watchedFields,
      headerImageUrl,
    };

    try {
      const response = await fetch("/api/generate-pdf-tsx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating PDF preview:", error);
      alert("Error generating PDF preview. Please try again.");
    }
  };

  const onSubmit = async (data: FormData) => {
    const formData = {
      ...data,
      headerImageUrl,
    };

    console.log("Form submitted:", formData);
    console.log("Form errors:", errors);
    console.log("Form is valid:", Object.keys(errors).length === 0);

    setIsGeneratingPDF(true);
    
    try {
      console.log("Starting PDF generation with data:", formData);
      
      // Generate PDF
      const response = await fetch("/api/generate-pdf-tsx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("PDF API response status:", response.status);
      console.log("PDF API response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("PDF API error response:", errorText);
        throw new Error(`Failed to generate PDF: ${response.status} - ${errorText}`);
      }

      // Create blob and download
      const blob = await response.blob();
      console.log("PDF blob size:", blob.size, "bytes");
      
      if (blob.size === 0) {
        throw new Error("Generated PDF is empty");
      }
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `security-clearance-${data.clearanceType.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Show success message
      alert("PDF generated and downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error generating PDF: ${errorMessage}. Please check the console for details.`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-12 p-6">
            {/* Clearance Type Section */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Security Clearance Type
                </h3>
                <p className="text-sm text-muted-foreground">
                  Select the type of security clearance you need
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    value: "Permanent",
                    label: "Permanent",
                    description: "Long-term clearance for extended projects",
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
                    label: "Temporary",
                    description: "Short-term clearance for specific tasks",
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
                    label: "Urgent",
                    description: "Emergency clearance for immediate needs",
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
                    className={`relative cursor-pointer transition-all duration-200 rounded-lg ${
                      watchedFields.clearanceType === type.value
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
                      className={`border rounded-lg p-6 text-center transition-all duration-200 ${
                        watchedFields.clearanceType === type.value
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
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Entry Approval Type
                </h3>
                <p className="text-sm text-muted-foreground">
                  {watchedFields.clearanceType === "Temporary" ||
                  watchedFields.clearanceType === "Urgent"
                    ? "Automatically set to 'New' for Temporary and Urgent clearances"
                    : "Choose the type of entry approval"}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  {
                    value: "New",
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
                      className={`relative transition-all duration-200 rounded-lg ${
                        isDisabled
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      } ${
                        watchedFields.entryApprovalType === opt.value
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
                        className={`border rounded-lg p-4 text-center transition-all duration-200 ${
                          watchedFields.entryApprovalType === opt.value
                            ? "border-foreground bg-muted/50"
                            : isDisabled
                            ? "border-border bg-muted/20"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          {opt.icon}
                          <span className="text-sm font-medium">
                            {opt.value}
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
                    Company Letterhead
                  </Label>

                  {!headerImageUrl ? (
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
                        isDragOver
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
                        className={`mx-auto h-8 w-8 mb-3 ${
                          isDragOver ? "text-blue-500" : "text-muted-foreground"
                        }`}
                      />
                      <p className="text-sm font-medium text-foreground mb-1">
                        {isDragOver
                          ? "Drop your image here"
                          : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-muted-foreground mb-1">
                        PNG, JPG, GIF up to 10MB
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Required: 680x96 to 1360x192 pixels (banner format)
                      </p>

                      <input
                        type="file"
                        id="headerImage"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />

                      {isUploading && (
                        <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-sm text-foreground">
                              Uploading...
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative group rounded-lg overflow-hidden border border-border">
                      <img
                        src={headerImageUrl}
                        alt="Company letterhead"
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
                          Replace
                        </button>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                        >
                          Delete
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div>
                    <Label
                      htmlFor="companyNameEnglish"
                      className="text-sm font-medium"
                    >
                      Company Name (English)
                    </Label>
                    <Input
                      id="companyNameEnglish"
                      {...register("companyNameEnglish")}
                      placeholder="Enter company name in English"
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
                      Company Name (Arabic)
                    </Label>
                    <Input
                      id="companyNameArabic"
                      {...register("companyNameArabic")}
                      placeholder="أدخل اسم الشركة بالعربية"
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
                      Company Email
                    </Label>
                    <Input
                      id="contactInfo"
                      type="email"
                      {...register("contactInfo")}
                      placeholder="Enter company email address"
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
                      Contract Number
                    </Label>
                    <Input
                      id="contractNumber"
                      {...register("contractNumber")}
                      placeholder="Enter contract number"
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
                      Contract Starting Date
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
                      Contract End Date
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
                      Duration (Days)
                    </Label>
                    <Input
                      id="duration"
                      {...register("duration")}
                      placeholder="e.g., 0"
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
                      Contracted With (English)
                    </Label>
                    <Input
                      id="contractedWithEnglish"
                      {...register("contractedWithEnglish")}
                      placeholder="Enter contracted with in English"
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
                      المتعاقد مع (عربي)
                    </Label>
                    <Input
                      id="contractedWithArabic"
                      {...register("contractedWithArabic")}
                      placeholder="أدخل المتعاقد مع بالعربية"
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
                          Contract Subject (English)
                        </Label>
                        <Textarea
                          id="contractSubjectEnglish"
                          {...register("contractSubjectEnglish")}
                          placeholder="Describe the contract subject in English"
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
                          موضوع العقد (عربي)
                        </Label>
                        <Textarea
                          id="contractSubjectArabic"
                          {...register("contractSubjectArabic")}
                          placeholder="اكتب موضوع العقد بالعربية"
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
                        Number of Iraqis
                      </Label>
                      <Input
                        id="numberOfIraqis"
                        type="number"
                        {...register("numberOfIraqis")}
                        placeholder="0"
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
                        Number of Internationals
                      </Label>
                      <Input
                        id="numberOfInternationals"
                        type="number"
                        {...register("numberOfInternationals")}
                        placeholder="0"
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
                        Number of Vehicles
                      </Label>
                      <Input
                        id="numberOfVehicles"
                        type="number"
                        {...register("numberOfVehicles")}
                        placeholder="0"
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
                        Number of Weapons
                      </Label>
                      <Input
                        id="numberOfWeapons"
                        type="number"
                        {...register("numberOfWeapons")}
                        placeholder="0"
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
                            Purpose of Entry (English)
                          </Label>
                          <Textarea
                            id="purposeOfEntry"
                            {...register("purposeOfEntry")}
                            placeholder="Describe the purpose of entry in English"
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
                            الغرض من الدخول (عربي)
                          </Label>
                          <Textarea
                            id="purposeOfEntryArabic"
                            {...register("purposeOfEntryArabic")}
                            placeholder="اكتب الغرض من الدخول بالعربية"
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
                      Manager Name
                    </Label>
                    <Input
                      id="managerName"
                      {...register("managerName")}
                      placeholder="Enter manager name"
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
                      Position
                    </Label>
                    <Input
                      id="position"
                      {...register("position")}
                      placeholder="Enter position"
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
                      Authorized Person Name (English)
                    </Label>
                    <Input
                      id="authorizedPersonName"
                      {...register("authorizedPersonName")}
                      placeholder="Enter authorized person name"
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
                      الاسم (عربي)
                    </Label>
                    <Input
                      id="authorizedPersonNameArabic"
                      {...register("authorizedPersonNameArabic")}
                      placeholder="أدخل اسم الشخص المخول"
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
                      Phone Number
                    </Label>
                    <Input
                      id="fpPhone"
                      {...register("fpPhone")}
                      placeholder="Enter phone number"
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
                      ID Number (Civil ID/Passport)
                    </Label>
                    <Input
                      id="authorizedPersonId"
                      {...register("authorizedPersonId")}
                      placeholder="Enter ID number"
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
                      Authorization Start Date
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
                      Authorization End Date
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
            {/* Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Review & Submit</h2>
              <p className="text-muted-foreground">
                Please review all information before generating your documents
              </p>
            </div>

            {/* Summary Section */}
            <div className="bg-white border rounded-xl p-6 space-y-6">
              {/* Clearance Type */}
              <div className="pb-4 border-b">
                <h3 className="font-semibold text-lg mb-3">Clearance Type</h3>
                <Badge variant="secondary" className="text-base px-4 py-2">
                  {watchedFields.clearanceType}
                </Badge>
              </div>

              {/* Company & Contract Info */}
              <div className="grid md:grid-cols-2 gap-6 pb-4 border-b">
                <div>
                  <h4 className="font-medium mb-3 text-gray-900">Company Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Company:</span>
                      <span className="ml-2 font-medium">{watchedFields.companyNameEnglish}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Contracted with:</span>
                      <span className="ml-2 font-medium">{watchedFields.contractedWithEnglish}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3 text-gray-900">Contract Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Contract Number:</span>
                      <span className="ml-2 font-medium">{watchedFields.contractNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <span className="ml-2 font-medium">{watchedFields.startingDate} to {watchedFields.endDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Staff & Authorization */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-gray-900">Staff & Resources</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Iraqis:</span>
                      <span className="ml-2 font-medium">{watchedFields.numberOfIraqis}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Internationals:</span>
                      <span className="ml-2 font-medium">{watchedFields.numberOfInternationals}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Vehicles:</span>
                      <span className="ml-2 font-medium">{watchedFields.numberOfVehicles}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Weapons:</span>
                      <span className="ml-2 font-medium">{watchedFields.numberOfWeapons}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3 text-gray-900">Authorized Representative</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <span className="ml-2 font-medium">{watchedFields.authorizedPersonName}</span>
                      {watchedFields.authorizedPersonNameArabic && (
                        <div className="text-xs text-gray-500 mt-1 ml-2">
                          Arabic: {watchedFields.authorizedPersonNameArabic}
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="text-gray-600">ID Number:</span>
                      <span className="ml-2 font-medium">{watchedFields.authorizedPersonId}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Authorization Period:</span>
                      <span className="ml-2 font-medium">{watchedFields.authorizationStartDate} to {watchedFields.authorizationEndDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div>
                  <h5 className="font-medium text-blue-900 mb-1">Ready to Generate Documents</h5>
                  <p className="text-sm text-blue-700">
                    All information has been reviewed. Click &quot;Download PDF&quot; to generate your security clearance documents.
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
      <div className="mx-auto w-5xl px-4 h-[90vh]">
        <div className="rounded-2xl bg-white h-full flex flex-col">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-blue-100 px-4 py-3 md:px-6 flex-shrink-0">
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
            >
              <Logo width={25} height={25} />
              <span>Petrochina - Security Department</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 min-h-0">
            {/* Left Rail - Vertical Stepper */}
            <aside className="border-r border-blue-100 p-8 w-2/6 overflow-y-auto">
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
                        <div className="absolute left-[11px] top-6 w-0.5 h-18">
                          <div
                            className={`w-full h-full transition-all duration-300 ${
                              isCompleted
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
                          className={`flex h-6 w-6 shrink-0 mt-0.5 items-center justify-center rounded-full border-2 text-xs font-medium transition-all duration-300 ${
                            isCompleted
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
                          className={`text-sm font-semibold transition-colors duration-200 ${
                            isActive
                              ? "text-foreground"
                              : isCompleted
                              ? "text-foreground/90"
                              : "text-muted-foreground"
                          }`}
                        >
                          {step.title}
                        </div>
                        <div
                          className={`text-xs mt-1 transition-colors duration-200 ${
                            isActive
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
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>

                    {currentStep < steps.length ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="flex items-center gap-2"
                      >
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <div className="flex gap-3">
                        <Button
                          type="submit"
                          onClick={(e) => {
                            console.log("Download PDF button clicked!");
                            console.log("Current form errors:", errors);
                            handleSubmit(onSubmit)(e);
                          }}
                          disabled={isGeneratingPDF}
                          className="flex items-center gap-2 min-w-[140px]"
                        >
                          {isGeneratingPDF ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4" />
                              Download PDF
                            </>
                          )}
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
    </div>
  );
}
