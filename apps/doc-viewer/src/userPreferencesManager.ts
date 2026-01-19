import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.boolean().default(true),
  language: z.string().min(2).default('en'),
  fontSize: z.number().min(12).max(24).default(16),
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
        const validated = PreferenceSchema.parse({
          ...parsed,
          lastUpdated: parsed.lastUpdated ? new Date(parsed.lastUpdated) : undefined
        });
        return validated;
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
        lastUpdated: new Date().toISOString()
      });
      localStorage.setItem(UserPreferencesManager.STORAGE_KEY, data);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    try {
      const merged = { ...this.preferences, ...updates };
      const validated = PreferenceSchema.parse(merged);
      this.preferences = validated;
      this.savePreferences();
      return true;
    } catch (error) {
      console.error('Invalid preferences update:', error);
      return false;
    }
  }

  resetToDefaults(): void {
    this.preferences = PreferenceSchema.parse({});
    this.savePreferences();
  }

  hasValidPreferences(): boolean {
    try {
      PreferenceSchema.parse(this.preferences);
      return true;
    } catch {
      return false;
    }
  }
}

export { UserPreferencesManager, type UserPreferences };interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor(defaultPreferences: UserPreferences) {
    this.preferences = this.loadPreferences() || defaultPreferences;
  }

  private loadPreferences(): UserPreferences | null {
    try {
      const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private savePreferences(): void {
    localStorage.setItem(
      UserPreferencesManager.STORAGE_KEY,
      JSON.stringify(this.preferences)
    );
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    if (updates.fontSize !== undefined && (updates.fontSize < 12 || updates.fontSize > 24)) {
      throw new Error('Font size must be between 12 and 24');
    }

    this.preferences = { ...this.preferences, ...updates };
    this.savePreferences();
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(defaults: UserPreferences): void {
    this.preferences = { ...defaults };
    this.savePreferences();
  }
}

const defaultPreferences: UserPreferences = {
  theme: 'auto',
  language: 'en-US',
  notificationsEnabled: true,
  fontSize: 16
};

export const userPrefs = new UserPreferencesManager(defaultPreferences);