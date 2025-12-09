/**
 * Form Storage Utilities
 * 
 * This file handles localStorage operations for persisting form data
 * across page refreshes and navigation.
 */

import { TableData } from "@/lib/file-parser";

/**
 * Storage keys for localStorage
 */
const STORAGE_KEYS = {
  FORM_DATA: "formData",
  TABLE_DATA: "tableData",
  TABLE_FILE_NAMES: "tableFileNames",
  HEADER_IMAGE: "headerImageUrl",
} as const;

/**
 * Table data structure
 */
export interface TableDataState {
  weapons: TableData[];
  vehicles: TableData[];
  international_staff: TableData[];
  local_staff: TableData[];
}

/**
 * Table file names structure
 */
export interface TableFileNamesState {
  weapons: string;
  vehicles: string;
  international_staff: string;
  local_staff: string;
}

/**
 * Saves form data to localStorage
 */
export const saveFormData = (formData: Record<string, unknown>): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(formData));
  } catch (error) {
    console.error("Error saving form data:", error);
  }
};

/**
 * Loads form data from localStorage
 */
export const loadFormData = (): Record<string, unknown> | null => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error("Error loading form data:", error);
    return null;
  }
};

/**
 * Saves table data to localStorage
 */
export const saveTableData = (tableData: TableDataState): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TABLE_DATA, JSON.stringify(tableData));
  } catch (error) {
    console.error("Error saving table data:", error);
  }
};

/**
 * Loads table data from localStorage
 */
export const loadTableData = (): TableDataState | null => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEYS.TABLE_DATA);
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error("Error loading table data:", error);
    return null;
  }
};

/**
 * Saves table file names to localStorage
 */
export const saveTableFileNames = (fileNames: TableFileNamesState): void => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.TABLE_FILE_NAMES,
      JSON.stringify(fileNames)
    );
  } catch (error) {
    console.error("Error saving table file names:", error);
  }
};

/**
 * Loads table file names from localStorage
 */
export const loadTableFileNames = (): TableFileNamesState | null => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEYS.TABLE_FILE_NAMES);
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error("Error loading table file names:", error);
    return null;
  }
};

/**
 * Saves header image URL to localStorage
 */
export const saveHeaderImage = (imageUrl: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.HEADER_IMAGE, imageUrl);
  } catch (error) {
    console.error("Error saving header image:", error);
  }
};

/**
 * Loads header image URL from localStorage
 */
export const loadHeaderImage = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.HEADER_IMAGE);
  } catch (error) {
    console.error("Error loading header image:", error);
    return null;
  }
};

/**
 * Clears all saved form data from localStorage
 */
export const clearAllFormData = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error("Error clearing form data:", error);
  }
};

