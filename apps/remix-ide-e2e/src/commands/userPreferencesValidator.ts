import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    frequency: z.enum(['instant', 'daily', 'weekly']).optional()
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']),
    dataSharing: z.boolean().default(false)
  }),
  language: z.string().min(2).max(5)
}).refine((data) => {
  return !(data.privacy.dataSharing && data.privacy.profileVisibility === 'private');
}, {
  message: 'Cannot share data while profile is private',
  path: ['privacy']
});

export type UserPreferences = z.infer<typeof PreferenceSchema>;

export class PreferenceValidator {
  static validate(input: unknown): UserPreferences {
    return PreferenceSchema.parse(input);
  }

  static validatePartial(updates: Partial<UserPreferences>): Partial<UserPreferences> {
    return PreferenceSchema.partial().parse(updates);
  }

  static getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      notifications: {
        email: true,
        push: false,
        frequency: 'daily'
      },
      privacy: {
        profileVisibility: 'friends',
        dataSharing: false
      },
      language: 'en'
    };
  }
}