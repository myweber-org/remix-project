import { z } from 'zod';

const preferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).default('friends'),
    dataSharing: z.boolean().default(false)
  }).strict(),
  language: z.string().min(2).max(5).default('en')
}).strict();

type UserPreferences = z.infer<typeof preferenceSchema>;

export function validatePreferences(input: unknown): UserPreferences {
  try {
    return preferenceSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      throw new Error(`Invalid preferences: ${JSON.stringify(fieldErrors)}`);
    }
    throw error;
  }
}

export function getDefaultPreferences(): UserPreferences {
  return preferenceSchema.parse({});
}