import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  fontSize: z.number().min(12).max(24).default(16),
  notificationsEnabled: z.boolean().default(true),
  language: z.string().default('en-US'),
  lastUpdated: z.string().datetime().optional()
});

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  fontSize: 16,
  notificationsEnabled: true,
  language: 'en-US'
};

const STORAGE_KEY = 'app_user_preferences';

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return DEFAULT_PREFERENCES;

      const parsed = JSON.parse(stored);
      const result = UserPreferencesSchema.safeParse(parsed);

      return result.success ? result.data : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }

  private savePreferences(): void {
    const dataToSave = {
      ...this.preferences,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const validated = UserPreferencesSchema.partial().safeParse(updates);
    if (!validated.success) return;

    this.preferences = { ...this.preferences, ...validated.data };
    this.savePreferences();
  }

  resetToDefaults(): void {
    this.preferences = DEFAULT_PREFERENCES;
    localStorage.removeItem(STORAGE_KEY);
  }

  hasStoredPreferences(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }
}

export const userPreferences = new UserPreferencesManager();