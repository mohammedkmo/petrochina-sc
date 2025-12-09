/**
 * Form Types
 * 
 * Shared TypeScript types and interfaces for the form system
 */

import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from "react-hook-form";
import { TableData } from "@/lib/file-parser";

/**
 * Base form data type (inferred from schema)
 */
export type FormData = {
  clearanceType: "Permanent" | "Temporary" | "Urgent";
  entryApprovalType?: string;
  companyNameEnglish: string;
  companyNameArabic: string;
  contractedWithEnglish: string;
  contractedWithArabic: string;
  contractNumber: string;
  contractSubjectEnglish: string;
  contractSubjectArabic: string;
  startingDate: string;
  endDate: string;
  duration: string;
  numberOfIraqis: string;
  numberOfInternationals: string;
  numberOfVehicles: string;
  numberOfWeapons: string;
  managerName: string;
  position: string;
  fpPhone: string;
  purposeOfEntry?: string;
  purposeOfEntryArabic?: string;
  authorizedPersonName: string;
  authorizedPersonNameArabic: string;
  authorizedPersonId: string;
  authorizationStartDate: string;
  authorizationEndDate: string;
  contactInfo: string;
  headerImageUrl: string;
  weaponsData?: TableData[];
  vehiclesData?: TableData[];
  internationalStaffData?: TableData[];
  localStaffData?: TableData[];
};

/**
 * Props for form step components
 */
export interface StepComponentProps {
  register: UseFormRegister<FormData>;
  setValue: UseFormSetValue<FormData>;
  watch: UseFormWatch<FormData>;
  errors: FieldErrors<FormData>;
  t: (key: string) => string;
  locale: string;
}

/**
 * Table data state
 */
export interface TableDataState {
  weapons: TableData[];
  vehicles: TableData[];
  international_staff: TableData[];
  local_staff: TableData[];
}

/**
 * Table file names state
 */
export interface TableFileNamesState {
  weapons: string;
  vehicles: string;
  international_staff: string;
  local_staff: string;
}

