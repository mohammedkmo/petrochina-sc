import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export interface TableData {
  [key: string]: string | number;
}

export interface ParseResult {
  data: TableData[];
  headers: string[];
  rowCount: number;
  errors: string[];
}

// Expected column mappings for different table types
export const TABLE_COLUMN_MAPPINGS = {
  weapons: {
    required: ['weaponNumber', 'weaponType', 'licenceId', 'workLocation'],
    optional: []
  },
  vehicles: {
    required: ['vehicleNumber', 'vehicleBrand/Type', 'vehicleColor', 'workLocation'],
    optional: []
  },
  international_staff: {
    required: ['fullName', 'position', 'IDNumber', 'workLocation'],
    optional: []
  },
  local_staff: {
    required: ['fullName', 'position', 'idNumber', 'workLocation'],
    optional: []
  }
};

export const parseExcelFile = async (file: File): Promise<ParseResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', codepage: 65001 }); // UTF-8 codepage
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false, defval: '' }) as (string | number)[][];
        
        if (jsonData.length === 0) {
          resolve({ data: [], headers: [], rowCount: 0, errors: ['File is empty'] });
          return;
        }
        
        const headers = jsonData[0].map(h => String(h).trim());
        const rows = jsonData.slice(1);
        
        const parsedData: TableData[] = [];
        const errors: string[] = [];
        
        rows.forEach((row) => {
          // Skip empty rows
          if (!row.some(cell => cell !== undefined && cell !== '')) {
            return;
          }
          
          const rowData: TableData = {};
          headers.forEach((header, colIndex) => {
            const value = row[colIndex];
            rowData[header] = value !== undefined ? String(value).trim() : '';
          });
          
          // Basic validation - check if row has at least one non-empty value
          const hasData = Object.values(rowData).some(value => value !== '');
          if (hasData) {
            parsedData.push(rowData);
          }
        });
        
        resolve({
          data: parsedData,
          headers,
          rowCount: parsedData.length,
          errors
        });
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

export const parseCSVFile = async (file: File): Promise<ParseResult> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: 'UTF-8',
      transformHeader: (header: string) => header.trim(),
      transform: (value: string) => value.trim(),
      complete: (results) => {
        try {
          const errors: string[] = [];
          
          // Collect parsing errors
          if (results.errors.length > 0) {
            results.errors.forEach(error => {
              errors.push(`Row ${error.row}: ${error.message}`);
            });
          }
          
          const data = results.data as TableData[];
          const headers = results.meta.fields || [];
          
          // Filter out completely empty rows
          const filteredData = data.filter(row => 
            Object.values(row).some(value => value !== '')
          );
          
          resolve({
            data: filteredData,
            headers,
            rowCount: filteredData.length,
            errors
          });
        } catch (error) {
          reject(new Error(`Failed to process CSV data: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      },
      error: (error) => {
        reject(new Error(`Failed to parse CSV file: ${error.message}`));
      }
    });
  });
};

export const validateTableData = (
  data: TableData[],
  tableType: keyof typeof TABLE_COLUMN_MAPPINGS
): { isValid: boolean; errors: string[]; warnings: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const mapping = TABLE_COLUMN_MAPPINGS[tableType];
  
  if (!mapping) {
    errors.push(`Unknown table type: ${tableType}`);
    return { isValid: false, errors, warnings };
  }
  
  if (data.length === 0) {
    errors.push('No data found in file');
    return { isValid: false, errors, warnings };
  }
  
  // Get available headers from the first row
  const availableHeaders = Object.keys(data[0]);
  
  // Check for required columns
  const missingRequired = mapping.required.filter(
    col => !availableHeaders.some(header => 
      header.toLowerCase().includes(col.toLowerCase()) ||
      col.toLowerCase().includes(header.toLowerCase())
    )
  );
  
  if (missingRequired.length > 0) {
    errors.push(`Missing required columns: ${missingRequired.join(', ')}`);
  }
  
  // Check each row for required data
  data.forEach((row, index) => {
    const emptyRequired = mapping.required.filter(col => {
      const matchingHeader = availableHeaders.find(header => 
        header.toLowerCase().includes(col.toLowerCase()) ||
        col.toLowerCase().includes(header.toLowerCase())
      );
      return matchingHeader && (!row[matchingHeader] || row[matchingHeader] === '');
    });
    
    if (emptyRequired.length > 0) {
      warnings.push(`Row ${index + 1}: Missing data for ${emptyRequired.join(', ')}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const normalizeTableData = (
  data: TableData[],
  tableType: keyof typeof TABLE_COLUMN_MAPPINGS
): TableData[] => {
  const mapping = TABLE_COLUMN_MAPPINGS[tableType];
  if (!mapping || data.length === 0) return data;
  
  return data.map(row => {
    const normalizedRow: TableData = {};
    const availableHeaders = Object.keys(row);
    
    // Map known columns
    [...mapping.required, ...mapping.optional].forEach(expectedCol => {
      const matchingHeader = availableHeaders.find(header => 
        header.toLowerCase().includes(expectedCol.toLowerCase()) ||
        expectedCol.toLowerCase().includes(header.toLowerCase())
      );
      
      if (matchingHeader) {
        normalizedRow[expectedCol] = row[matchingHeader];
      } else {
        normalizedRow[expectedCol] = '';
      }
    });
    
    // Include any additional columns that don't match expected ones
    availableHeaders.forEach(header => {
      const isMatched = [...mapping.required, ...mapping.optional].some(expectedCol => 
        header.toLowerCase().includes(expectedCol.toLowerCase()) ||
        expectedCol.toLowerCase().includes(header.toLowerCase())
      );
      
      if (!isMatched) {
        normalizedRow[header] = row[header];
      }
    });
    
    return normalizedRow;
  });
};