import { z } from 'zod';

const preferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }),
  language: z.string().min(2).max(5).default('en'),
  timezone: z.string().refine(tz => {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: tz });
      return true;
    } catch {
      return false;
    }
  }, { message: 'Invalid timezone identifier' }).default('UTC')
}).refine(data => {
  return !(data.privacy.profileVisibility === 'public' && data.privacy.searchIndexing === false);
}, { message: 'Public profiles must be searchable', path: ['privacy.searchIndexing'] });

export type UserPreferences = z.infer<typeof preferenceSchema>;

export class PreferenceValidator {
  static validate(input: unknown): { success: boolean; data?: UserPreferences; errors?: string[] } {
    const result = preferenceSchema.safeParse(input);
    
    if (!result.success) {
      const errors = result.error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      return { success: false, errors };
    }
    
    return { success: true, data: result.data };
  }

  static getDefaultPreferences(): UserPreferences {
    return preferenceSchema.parse({});
  }

  static mergeWithDefaults(partial: Partial<UserPreferences>): UserPreferences {
    const defaults = this.getDefaultPreferences();
    return preferenceSchema.parse({ ...defaults, ...partial });
  }
}