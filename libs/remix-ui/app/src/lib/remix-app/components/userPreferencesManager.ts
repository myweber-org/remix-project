import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('light'),
  notifications: z.boolean().default(true),
  fontSize: z.number().min(12).max(24).default(16),
  language: z.string().min(2).default('en'),
  autoSave: z.boolean().default(true),
  lastUpdated: z.date().optional()
});

type UserPreferences = z.infer<typeof PreferenceSchema>;

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.lastUpdated = parsed.lastUpdated ? new Date(parsed.lastUpdated) : undefined;
        return PreferenceSchema.parse(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences, using defaults:', error);
    }
    return PreferenceSchema.parse({});
  }

  private savePreferences(): void {
    try {
      const data = JSON.stringify({
        ...this.preferences,
        lastUpdated: new Date()
      });
      localStorage.setItem(UserPreferencesManager.STORAGE_KEY, data);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const validated = PreferenceSchema.partial().parse(updates);
    this.preferences = { ...this.preferences, ...validated };
    this.savePreferences();
    return this.preferences;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  resetToDefaults(): UserPreferences {
    this.preferences = PreferenceSchema.parse({});
    this.savePreferences();
    return this.preferences;
  }

  validateExternalData(data: unknown): UserPreferences {
    return PreferenceSchema.parse(data);
  }
}

export { UserPreferencesManager, type UserPreferences };