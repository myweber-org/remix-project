import { z } from 'zod';

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }),
  language: z.string().min(2).max(5).default('en')
}).refine(
  (data) => !(data.privacy.profileVisibility === 'public' && data.privacy.searchIndexing === false),
  {
    message: 'Public profiles must be searchable',
    path: ['privacy', 'searchIndexing']
  }
);

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  return userPreferencesSchema.parse(input);
}

export function getValidationErrors(input: unknown): string[] {
  try {
    userPreferencesSchema.parse(input);
    return [];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
    }
    return ['Invalid input format'];
  }
}import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.boolean().default(true),
  language: z.string().min(2).max(5).default('en'),
  fontSize: z.number().min(12).max(24).default(16),
  autoSave: z.boolean().default(false),
  twoFactorAuth: z.boolean().default(false)
});

type UserPreferences = z.infer<typeof PreferenceSchema>;

export class PreferenceValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return PreferenceSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.warn('Invalid preferences provided, using defaults:', error.errors);
      }
      return PreferenceSchema.parse({});
    }
  }

  static mergeWithDefaults(partialPrefs: Partial<UserPreferences>): UserPreferences {
    const validated = this.validate(partialPrefs);
    return { ...this.getDefaults(), ...validated };
  }

  static getDefaults(): UserPreferences {
    return PreferenceSchema.parse({});
  }

  static isValid(prefs: unknown): prefs is UserPreferences {
    return PreferenceSchema.safeParse(prefs).success;
  }
}

export function sanitizePreferences(rawData: Record<string, unknown>): UserPreferences {
  const filtered = Object.fromEntries(
    Object.entries(rawData).filter(([key]) => 
      Object.keys(PreferenceSchema.shape).includes(key)
    )
  );
  return PreferenceValidator.mergeWithDefaults(filtered);
}