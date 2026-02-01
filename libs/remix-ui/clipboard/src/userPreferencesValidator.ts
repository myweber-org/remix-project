import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  fontSize: z.number().min(12).max(24),
  language: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/),
  autoSave: z.boolean().default(true),
  refreshInterval: z.number().positive().optional(),
});

type UserPreferences = z.infer<typeof PreferenceSchema>;

export function validatePreferences(data: unknown): UserPreferences {
  try {
    return PreferenceSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      throw new PreferenceValidationError('Invalid preferences', issues);
    }
    throw error;
  }
}

export class PreferenceValidationError extends Error {
  constructor(
    message: string,
    public readonly issues: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

export function getDefaultPreferences(): UserPreferences {
  return {
    theme: 'auto',
    notifications: true,
    fontSize: 16,
    language: 'en-US',
    autoSave: true,
  };
}