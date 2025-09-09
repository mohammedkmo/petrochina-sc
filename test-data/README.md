# Test Data Files

This directory contains sample CSV and Excel files for testing the file import functionality.

## Files:

### CSV Files:
- `weapons-sample.csv` - Sample weapons data with required and optional columns
- `vehicles-sample.csv` - Sample vehicles data with required and optional columns
- `international-staff-sample.csv` - Sample international staff data
- `local-staff-sample.csv` - Sample local staff data

### Testing Instructions:

1. Start the development server: `npm run dev`
2. Navigate to the form and go to Step 4 (Staff Information)
3. Use the file upload components to test importing each CSV file
4. Verify that:
   - Files are parsed correctly
   - Required column validation works
   - Data is displayed properly in the form
   - PDF generation includes the imported data

### Expected Columns:

**Weapons:**
- Required: weaponNumber, weaponType, licenceId, workLocation
- Optional: manufacturer, condition, notes, serialNumber, model, caliber

**Vehicles:**
- Required: vehicleNumber, vehicleType, vehicleBrand, vehicleColor, workLocation
- Optional: manufacturer, condition, notes, plateNumber, model, year

**International Staff:**
- Required: fullName, position, passportNumber, workLocation
- Optional: nationality, department, startDate, endDate, notes

**Local Staff:**
- Required: fullName, position, idNumber, workLocation
- Optional: phoneNumber, address, startDate, notes, department

### Column Descriptions:

**Weapons:**
- `weaponNumber`: Unique identifier for the weapon
- `weaponType`: Type/category of weapon (e.g., Rifle, Pistol, Shotgun)
- `licenceId`: License identification number
- `workLocation`: Location where the weapon is assigned

**Vehicles:**
- `vehicleNumber`: Unique identifier for the vehicle
- `vehicleType`: Type of vehicle (e.g., SUV, Sedan, Truck)
- `vehicleBrand`: Brand/manufacturer of the vehicle
- `vehicleColor`: Color of the vehicle
- `workLocation`: Location where the vehicle is assigned

**Staff (Both Local and International):**
- `fullName`: Complete name of the staff member
- `position`: Job title/position
- `workLocation`: Location where the staff member is assigned
- `idNumber` (Local Staff): National ID number
- `passportNumber` (International Staff): Passport number

### Error Testing:

To test validation, try:
1. Uploading files with missing required columns
2. Uploading empty files
3. Uploading files with incorrect formats
4. Uploading very large files (>10MB)