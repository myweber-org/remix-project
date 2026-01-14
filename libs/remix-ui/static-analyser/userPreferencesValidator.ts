import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2).max(5),
  fontSize: z.number().min(12).max(24),
  autoSave: z.boolean().default(true),
  twoFactorAuth: z.boolean().optional()
});

type UserPreferences = z.infer<typeof PreferenceSchema>;

export function validatePreferences(input: unknown): UserPreferences {
  try {
    return PreferenceSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      throw new Error(`Invalid preferences: ${errorMessages.join(', ')}`);
    }
    throw error;
  }
}

export function createDefaultPreferences(): UserPreferences {
  return {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 16,
    autoSave: true
  };
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const defaultPrefs = createDefaultPreferences();
  const merged = { ...defaultPrefs, ...existing, ...updates };
  return validatePreferences(merged);
}