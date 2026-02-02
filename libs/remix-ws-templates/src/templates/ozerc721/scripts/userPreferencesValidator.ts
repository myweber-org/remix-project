
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
    searchIndexing: z.boolean().default(true)
  })
}).strict();

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export class PreferencesManager {
  private preferences: UserPreferences;

  constructor(rawData?: Partial<UserPreferences>) {
    this.preferences = this.validateAndMerge(rawData || {});
  }

  private validateAndMerge(data: Partial<UserPreferences>): UserPreferences {
    try {
      return UserPreferencesSchema.parse(data);
    } catch (error) {
      console.warn('Invalid preferences provided, using defaults:', error);
      return UserPreferencesSchema.parse({});
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = this.validateAndMerge({
      ...this.preferences,
      ...updates
    });
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  exportForStorage(): string {
    return JSON.stringify(this.preferences);
  }

  static importFromStorage(storedData: string): PreferencesManager {
    try {
      const parsed = JSON.parse(storedData);
      return new PreferencesManager(parsed);
    } catch {
      return new PreferencesManager();
    }
  }
}

export function createDefaultPreferences(): UserPreferences {
  return UserPreferencesSchema.parse({});
}