# Form Steps Components

This directory contains individual step components for the multi-step form.

## Structure

Each step component follows a consistent pattern:

```typescript
import { StepComponentProps } from "@/lib/form-types";

export const StepName: React.FC<StepComponentProps> = ({
  register,
  setValue,
  watch,
  errors,
  t,
  locale,
}) => {
  // Component implementation
};
```

## Step Components

- **ClearanceTypeStep** - Step 1: Clearance type and entry approval type selection
- **DurationStep** - Step 6: Duration input with increment/decrement controls

## Adding New Steps

1. Create a new file: `StepNameStep.tsx`
2. Import `StepComponentProps` from `@/lib/form-types`
3. Implement the component following the pattern above
4. Export it from `index.ts`
5. Import and use it in `MultiStepForm.tsx`

## Best Practices

- Keep components focused on a single step
- Use the provided props (register, setValue, watch, errors)
- Ensure RTL support using `rtl:` and `ltr:` classes
- Add proper TypeScript types
- Include JSDoc comments for complex logic

