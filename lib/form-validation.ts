/**
 * Form Validation Logic
 * 
 * This file contains the validation logic for each step of the form.
 * It determines which fields need to be validated before proceeding to the next step.
 */

import { z } from "zod";

/**
 * Type for form data keys
 */
export type FormDataKey = string;

/**
 * Gets the fields that need to be validated for a specific step
 * @param stepNumber - The current step number (1-13)
 * @param clearanceType - The selected clearance type (for conditional validation)
 * @returns Array of field names to validate
 */
export const getFieldsToValidate = (
  stepNumber: number,
  clearanceType?: string
): FormDataKey[] => {
  switch (stepNumber) {
    case 1: // Clearance Type
      return ["clearanceType", "entryApprovalType"];

    case 2: // Company Identity
      return ["companyNameEnglish", "companyNameArabic"];

    case 3: // Company Contact
      return ["contactInfo", "headerImageUrl"];

    case 4: // Contract Partners
      return ["contractedWithEnglish", "contractedWithArabic"];

    case 5: // Contract Details
      return [
        "contractNumber",
        "contractSubjectEnglish",
        "contractSubjectArabic",
        "startingDate",
        "endDate",
      ];

    case 6: // Duration
      return ["duration"];

    case 7: // Staff Counts
      return ["numberOfIraqis", "numberOfInternationals"];

    case 8: // Resources
      return ["numberOfVehicles", "numberOfWeapons"];

    case 9: // Purpose
      // Purpose is only required for non-permanent clearance types
      if (clearanceType !== "Permanent") {
        return ["purposeOfEntry", "purposeOfEntryArabic"];
      }
      return [];

    case 10: // Management
      return ["managerName", "position"];

    case 11: // Authorized Person
      return [
        "authorizedPersonName",
        "authorizedPersonNameArabic",
        "fpPhone",
        "authorizedPersonId",
      ];

    case 12: // Authorization Validity
      return ["authorizationStartDate", "authorizationEndDate"];

    default:
      return [];
  }
};

/**
 * Default form values
 * Note: These are partial defaults - full form requires all fields
 */
export const defaultFormValues: Partial<{
  clearanceType: "Permanent" | "Temporary" | "Urgent";
  duration: string;
  entryApprovalType: string;
  numberOfIraqis: string;
  numberOfInternationals: string;
  numberOfVehicles: string;
  numberOfWeapons: string;
  authorizedPersonName: string;
  authorizedPersonNameArabic: string;
  authorizedPersonId: string;
  authorizationStartDate: string;
  authorizationEndDate: string;
}> = {
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
};

