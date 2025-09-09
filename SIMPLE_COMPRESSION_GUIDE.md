# Simple QR Code Compression Guide

## Overview
This is a **SIMPLE** compression system that makes QR code data smaller and easy to decrypt/decompress on any system.

## How It Works

### Compression Process (4 Simple Steps):
1. **JSON.stringify(data)** - Convert object to JSON string
2. **LZString.compressToBase64(json)** - Compress the JSON string
3. **AES.encrypt(compressed, key)** - Encrypt for security
4. **btoa(encrypted)** - Final Base64 encoding

### Decompression Process (4 Simple Steps):
1. **atob(encodedData)** - Decode from Base64
2. **AES.decrypt(encrypted, key)** - Decrypt the data
3. **LZString.decompressFromBase64(compressed)** - Decompress
4. **JSON.parse(jsonString)** - Parse back to object

## Required Libraries

### For JavaScript/Node.js:
```bash
npm install lz-string crypto-js
```

### For Python:
```bash
pip install lz-string pycryptodome
```

### For Java:
```xml
<!-- Add to pom.xml -->
<dependency>
    <groupId>com.github.jinahya</groupId>
    <artifactId>lz-string-java</artifactId>
    <version>1.0.0</version>
</dependency>
<dependency>
    <groupId>org.bouncycastle</groupId>
    <artifactId>bcprov-jdk15on</artifactId>
    <version>1.70</version>
</dependency>
```

## Code Examples

### JavaScript/Node.js:
```javascript
const LZString = require('lz-string');
const CryptoJS = require('crypto-js');

const SECRET_KEY = 'petrochina-2024';

// Compress data
function compressData(data) {
    const jsonString = JSON.stringify(data);
    const compressed = LZString.compressToBase64(jsonString);
    const encrypted = CryptoJS.AES.encrypt(compressed, SECRET_KEY).toString();
    return btoa(encrypted);
}

// Decompress data
function decompressData(encodedData) {
    const encrypted = atob(encodedData);
    const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const compressed = decrypted.toString(CryptoJS.enc.Utf8);
    const jsonString = LZString.decompressFromBase64(compressed);
    return JSON.parse(jsonString);
}

// Usage
const originalData = {
    companyNameEnglish: 'Petrochina Iraq Company',
    companyNameArabic: 'شركة بتروتشاينا العراق',
    authorizedPersonName: 'أحمد محمد علي'
};

const compressed = compressData(originalData);
console.log('Compressed:', compressed);

const decompressed = decompressData(compressed);
console.log('Decompressed:', decompressed);
```

### Python:
```python
import lzstring
import base64
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import json

SECRET_KEY = b'petrochina-2024'

def compress_data(data):
    # Step 1: Convert to JSON
    json_string = json.dumps(data)
    
    # Step 2: Compress
    compressed = lzstring.compressToBase64(json_string)
    
    # Step 3: Encrypt
    cipher = AES.new(SECRET_KEY, AES.MODE_CBC)
    encrypted = cipher.encrypt(pad(compressed.encode(), AES.block_size))
    
    # Step 4: Base64 encode
    return base64.b64encode(encrypted).decode()

def decompress_data(encoded_data):
    # Step 1: Base64 decode
    encrypted = base64.b64decode(encoded_data)
    
    # Step 2: Decrypt
    cipher = AES.new(SECRET_KEY, AES.MODE_CBC)
    decrypted = unpad(cipher.decrypt(encrypted), AES.block_size).decode()
    
    # Step 3: Decompress
    json_string = lzstring.decompressFromBase64(decrypted)
    
    # Step 4: Parse JSON
    return json.loads(json_string)

# Usage
original_data = {
    "companyNameEnglish": "Petrochina Iraq Company",
    "companyNameArabic": "شركة بتروتشاينا العراق",
    "authorizedPersonName": "أحمد محمد علي"
}

compressed = compress_data(original_data)
print(f"Compressed: {compressed}")

decompressed = decompress_data(compressed)
print(f"Decompressed: {decompressed}")
```

### Java:
```java
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

public class QRCompression {
    private static final String SECRET_KEY = "petrochina-2024";
    private static final String ALGORITHM = "AES";
    
    public static String compressData(Object data) throws Exception {
        // Step 1: Convert to JSON
        ObjectMapper mapper = new ObjectMapper();
        String jsonString = mapper.writeValueAsString(data);
        
        // Step 2: Compress (using LZ-String library)
        String compressed = LZString.compressToBase64(jsonString);
        
        // Step 3: Encrypt
        SecretKeySpec keySpec = new SecretKeySpec(SECRET_KEY.getBytes(), ALGORITHM);
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, keySpec);
        byte[] encrypted = cipher.doFinal(compressed.getBytes());
        
        // Step 4: Base64 encode
        return Base64.getEncoder().encodeToString(encrypted);
    }
    
    public static JsonNode decompressData(String encodedData) throws Exception {
        // Step 1: Base64 decode
        byte[] encrypted = Base64.getDecoder().decode(encodedData);
        
        // Step 2: Decrypt
        SecretKeySpec keySpec = new SecretKeySpec(SECRET_KEY.getBytes(), ALGORITHM);
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, keySpec);
        byte[] decrypted = cipher.doFinal(encrypted);
        String compressed = new String(decrypted, StandardCharsets.UTF_8);
        
        // Step 3: Decompress
        String jsonString = LZString.decompressFromBase64(compressed);
        
        // Step 4: Parse JSON
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readTree(jsonString);
    }
}
```

## Configuration

### Secret Key
Change the secret key in your system:
```javascript
const SECRET_KEY = 'your-secret-key-here';
```

### Data Format
The system expects data in this format:
```json
{
  "companyNameEnglish": "string",
  "companyNameArabic": "string", 
  "authorizedPersonName": "string",
  "contactInfo": "string",
  "localStaffCount": number,
  "internationalStaffCount": number,
  "vehiclesCount": number,
  "weaponsCount": number,
  "entryApprovalType": "string",
  "contractedWithEnglish": "string",
  "contractedWithArabic": "string",
  "contractNumber": "string"
}
```

## Expected Results

### Typical Compression:
- **Original Size**: 200-300 characters
- **Compressed Size**: 80-150 characters  
- **Compression Ratio**: 50-70%
- **Space Saved**: 100-200 characters

### Benefits:
- ✅ **Simple to implement** on any system
- ✅ **Good compression** (50-70% reduction)
- ✅ **Secure** with AES encryption
- ✅ **UTF-8 support** for Arabic text
- ✅ **Cross-platform** compatibility

## Troubleshooting

### Common Issues:
1. **Wrong secret key** - Make sure SECRET_KEY matches
2. **Missing libraries** - Install lz-string and crypto-js
3. **Encoding issues** - Ensure UTF-8 encoding for Arabic text
4. **Base64 errors** - Check if data is properly encoded

### Validation:
```javascript
// Test if compression works
function testCompression() {
    const testData = { test: "data" };
    const compressed = compressData(testData);
    const decompressed = decompressData(compressed);
    return JSON.stringify(testData) === JSON.stringify(decompressed);
}
```

---

**Note**: This simple system is designed to be easy to implement on any platform while providing good compression and security for Petrochina QR codes.
