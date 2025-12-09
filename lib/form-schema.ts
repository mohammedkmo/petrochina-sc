/**
 * Form Schema Configuration
 * 
 * This file contains the Zod schema definition for form validation.
 * The schema is created as a function to access translations dynamically.
 */

import { z } from "zod";

/**
 * Creates the form validation schema with translations
 * @param t - Translation function from next-intl
 * @returns Zod schema for form validation
 */
export const createFormSchema = (t: (key: string) => string) =>
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

      // Authorized Person
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

