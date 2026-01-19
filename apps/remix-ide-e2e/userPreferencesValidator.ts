import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).default('friends'),
    dataSharing: z.boolean().default(false)
  })
}).strict();

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export class PreferencesValidator {
  static validate(input: unknown): { success: boolean; data?: UserPreferences; error?: string } {
    try {
      const result = UserPreferencesSchema.safeParse(input);
      
      if (!result.success) {
        const firstError = result.error.errors[0];
        return {
          success: false,
          error: `Validation failed at ${firstError.path.join('.')}: ${firstError.message}`
        };
      }
      
      return {
        success: true,
        data: result.data
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown validation error'
      };
    }
  }

  static getDefaultPreferences(): UserPreferences {
    return UserPreferencesSchema.parse({});
  }

  static mergeWithDefaults(partialPrefs: Partial<UserPreferences>): UserPreferences {
    const defaults = this.getDefaultPreferences();
    return UserPreferencesSchema.parse({
      ...defaults,
      ...partialPrefs,
      notifications: {
        ...defaults.notifications,
        ...partialPrefs.notifications
      },
      privacy: {
        ...defaults.privacy,
        ...partialPrefs.privacy
      }
    });
  }
}