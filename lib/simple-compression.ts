import LZString from 'lz-string';
import CryptoJS from 'crypto-js';

// Simple secret key - change this in production
const SECRET_KEY = 'petrochina-2024';

/**
 * Simple compression function - just makes data smaller
 * @param data - The data object to compress
 * @returns Base64 encoded compressed string
 */
export function compressData(data: Record<string, unknown>): string {
  try {
    // Step 1: Convert to JSON string
    const jsonString = JSON.stringify(data);
    
    // Step 2: Compress using LZ-String (best compression for text)
    const compressed = LZString.compressToBase64(jsonString);
    
    // Step 3: Encrypt for security
    const encrypted = CryptoJS.AES.encrypt(compressed, SECRET_KEY).toString();
    
    // Step 4: Final Base64 encoding
    return btoa(encrypted);
    
  } catch (error) {
    console.error('Compression failed:', error);
    throw new Error('Failed to compress data');
  }
}

/**
 * Simple decompression function - restores original data
 * @param encodedData - Base64 encoded compressed string
 * @returns Original data object
 */
export function decompressData(encodedData: string): Record<string, unknown> {
  try {
    // Step 1: Decode from Base64
    const encrypted = atob(encodedData);
    
    // Step 2: Decrypt
    const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const compressed = decrypted.toString(CryptoJS.enc.Utf8);
    
    // Step 3: Decompress
    const jsonString = LZString.decompressFromBase64(compressed) || '';
    
    // Step 4: Parse back to object
    return JSON.parse(jsonString);
    
  } catch (error) {
    console.error('Decompression failed:', error);
    throw new Error('Failed to decompress data');
  }
}

/**
 * Get compression info
 * @param originalData - Original data
 * @param compressedData - Compressed data
 * @returns Compression statistics
 */
export function getCompressionInfo(originalData: Record<string, unknown>, compressedData: string): {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  spaceSaved: number;
} {
  const originalSize = JSON.stringify(originalData).length;
  const compressedSize = compressedData.length;
  const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;
  const spaceSaved = originalSize - compressedSize;
  
  return {
    originalSize,
    compressedSize,
    compressionRatio: Math.round(compressionRatio * 100) / 100,
    spaceSaved
  };
}

/**
 * Validate if compressed data can be decompressed
 * @param encodedData - Compressed data
 * @returns True if valid
 */
export function validateCompressedData(encodedData: string): boolean {
  try {
    decompressData(encodedData);
    return true;
  } catch {
    return false;
  }
}

// Export for use in other systems
export const COMPRESSION_INFO = {
  algorithm: 'LZ-String Base64 + AES',
  key: SECRET_KEY,
  libraries: ['lz-string', 'crypto-js'],
  steps: [
    '1. JSON.stringify(data)',
    '2. LZString.compressToBase64(json)',
    '3. AES.encrypt(compressed, key)',
    '4. btoa(encrypted)'
  ],
  reverseSteps: [
    '1. atob(encodedData)',
    '2. AES.decrypt(encrypted, key)',
    '3. LZString.decompressFromBase64(compressed)',
    '4. JSON.parse(jsonString)'
  ]
};
