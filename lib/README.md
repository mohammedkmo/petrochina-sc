# Form Library

This directory contains shared utilities and configurations for the form system.

## Files

### `form-schema.ts`
Zod validation schema for the entire form. Contains all field validations and conditional logic.

### `form-steps.ts`
Step definitions and metadata. Each step includes ID, title, description, and icon.

### `form-validation.ts`
Validation logic for determining which fields to validate at each step. Contains helper functions for step validation.

### `form-storage.ts`
localStorage utilities for persisting form data, table data, and file names across sessions.

### `form-types.ts`
Shared TypeScript types and interfaces used throughout the form system.

## Usage

```typescript
import { createFormSchema } from "@/lib/form-schema";
import { getSteps } from "@/lib/form-steps";
import { getFieldsToValidate } from "@/lib/form-validation";
import { saveFormData, loadFormData } from "@/lib/form-storage";
```

## Adding New Fields

1. Add field to `form-schema.ts`
2. Add validation in `form-validation.ts` if needed
3. Update `form-types.ts` with new type definitions
4. Update step components to include the new field

