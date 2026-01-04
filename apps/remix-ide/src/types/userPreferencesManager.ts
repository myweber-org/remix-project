import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  notifications: z.boolean().default(true),
  language: z.string().min(2).default('en'),
  fontSize: z.number().min(8).max(32).default(14),
  autoSave: z.boolean().default(true),
  experimentalFeatures: z.boolean().default(false)
});

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

const STORAGE_KEY = 'user_preferences_v1';

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return UserPreferencesSchema.parse({});

      const parsed = JSON.parse(stored);
      return UserPreferencesSchema.parse(parsed);
    } catch (error) {
      console.warn('Failed to load preferences, using defaults:', error);
      return UserPreferencesSchema.parse({});
    }
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    try {
      const validated = UserPreferencesSchema.partial().parse(updates);
      this.preferences = { ...this.preferences, ...validated };
      this.savePreferences();
      return this.getPreferences();
    } catch (error) {
      console.error('Invalid preferences update:', error);
      throw new Error('Invalid preferences data');
    }
  }

  resetToDefaults(): UserPreferences {
    this.preferences = UserPreferencesSchema.parse({});
    this.savePreferences();
    return this.getPreferences();
  }

  exportPreferences(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  importPreferences(jsonString: string): UserPreferences {
    try {
      const imported = JSON.parse(jsonString);
      return this.updatePreferences(imported);
    } catch (error) {
      console.error('Failed to import preferences:', error);
      throw new Error('Invalid preferences format');
    }
  }
}

export const userPreferences = new UserPreferencesManager();