/**
 * Company Contact & Header Step Component
 * 
 * Step 3: Contact information and company letterhead image upload
 */

import React from "react";
import { Upload, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { StepComponentProps } from "@/lib/form-types";
import ImageCropper from "@/components/ImageCropper";
import Image from "next/image";

interface CompanyContactStepProps extends StepComponentProps {
  headerImageUrl: string;
  isDragOver: boolean;
  isUploading: boolean;
  imageError: string | null;
  tempImageForCrop: string | null;
  onFileInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onRemoveImage: () => void;
  onCropComplete: (croppedImageDataUrl: string) => void;
  onCropCancel: () => void;
}

export const CompanyContactStep: React.FC<CompanyContactStepProps> = ({
  register,
  errors,
  t,
  headerImageUrl,
  isDragOver,
  isUploading,
  imageError,
  tempImageForCrop,
  onFileInputChange,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemoveImage,
  onCropComplete,
  onCropCancel,
}) => {
  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <Label htmlFor="contactInfo" className="text-sm font-medium text-gray-700">
          {t("form.labels.contactInfo")}
        </Label>
        <Input
          id="contactInfo"
          type="email"
          {...register("contactInfo")}
          placeholder={t("form.placeholders.contactInfo")}
          className="h-12 text-base px-4 rounded-xl border-2 border-gray-200 bg-white focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-medium placeholder:text-gray-400 hover:border-gray-300"
        />
        {errors.contactInfo && (
          <p className="text-red-600 text-xs mt-1.5">
            {errors.contactInfo.message}
          </p>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium mb-4 block text-gray-700">
          {t("form.companyLetterhead.title")}
        </Label>

        {!headerImageUrl ? (
          <div
            className={`relative border border-dashed bg-white rounded-lg p-8 text-center transition-all duration-200 cursor-pointer group ${
              isDragOver
                ? "border-gray-400 bg-gray-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
            }`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => document.getElementById("headerImage")?.click()}
          >
            <input
              id="headerImage"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileInputChange}
            />
            <div className="flex flex-col items-center justify-center space-y-4">
              {isUploading ? (
                <div className="p-3 rounded-full bg-gray-200 text-gray-600">
                  <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div
                  className={`p-3 rounded-full transition-colors ${
                    isDragOver
                      ? "bg-gray-200 text-gray-600"
                      : "bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600"
                  }`}
                >
                  <Upload className="w-6 h-6" />
                </div>
              )}
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                  {t("form.companyLetterhead.dragDrop")}
                </p>
                <p className="text-xs text-gray-500">
                  {t("form.companyLetterhead.maxSize")}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4 rounded-md px-5 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                onClick={(e) => {
                  e.stopPropagation();
                  document.getElementById("headerImage")?.click();
                }}
              >
                {t("form.companyLetterhead.browseFiles")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative rounded-lg overflow-hidden border border-gray-200 group h-40">
            <Image
              src={headerImageUrl}
              alt="Header Preview"
              fill
              className="object-cover bg-gray-50"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-md bg-white/90 hover:bg-white text-gray-900"
                onClick={onRemoveImage}
              >
                <Trash2 className="w-4 h-4 rtl:ml-2 ltr:mr-2" />
                {t("form.companyLetterhead.remove")}
              </Button>
            </div>
          </div>
        )}

        {errors.headerImageUrl && (
          <p className="text-red-600 text-xs mt-3 font-medium">
            {errors.headerImageUrl?.message}
          </p>
        )}
        {imageError && (
          <p className="text-red-600 text-xs mt-3 font-medium">{imageError}</p>
        )}

        {/* Image Cropper Dialog */}
        {tempImageForCrop && (
          <ImageCropper
            imageSrc={tempImageForCrop}
            onCrop={onCropComplete}
            onCancel={onCropCancel}
            targetWidth={1200}
            targetHeight={150}
          />
        )}
      </div>
    </div>
  );
};

