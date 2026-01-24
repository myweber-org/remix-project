import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
  }),
  language: z.string().min(2).max(5).default('en'),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).default('friends'),
    searchIndexing: z.boolean().default(true),
  }),
});

type UserPreferences = z.infer<typeof PreferenceSchema>;

export function validatePreferences(input: unknown): UserPreferences {
  try {
    return PreferenceSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation failed:', error.errors);
      throw new Error('Invalid preferences configuration');
    }
    throw error;
  }
}

export function getDefaultPreferences(): UserPreferences {
  return PreferenceSchema.parse({});
}