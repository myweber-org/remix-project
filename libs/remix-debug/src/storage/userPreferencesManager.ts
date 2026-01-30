import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2),
  timezone: z.string().min(3),
});

export class PreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';

  static validate(preferences: unknown): UserPreferences {
    return UserPreferencesSchema.parse(preferences);
  }

  static load(): UserPreferences | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;
      
      const parsed = JSON.parse(stored);
      return this.validate(parsed);
    } catch {
      return null;
    }
  }

  static save(preferences: UserPreferences): void {
    const validated = this.validate(preferences);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(validated));
  }

  static getDefault(): UserPreferences {
    return {
      theme: 'auto',
      notifications: true,
      language: navigator.language || 'en-US',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  static reset(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}interface UserPreferences {
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
    const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
    if (!stored) return null;

    try {
      const parsed = JSON.parse(stored);
      if (this.validatePreferences(parsed)) {
        return parsed;
      }
    } catch (error) {
      console.warn('Failed to parse stored preferences:', error);
    }
    return null;
  }

  private validatePreferences(data: any): data is UserPreferences {
    return (
      typeof data === 'object' &&
      data !== null &&
      ['light', 'dark', 'auto'].includes(data.theme) &&
      typeof data.language === 'string' &&
      typeof data.notificationsEnabled === 'boolean' &&
      typeof data.fontSize === 'number' &&
      data.fontSize >= 8 &&
      data.fontSize <= 32
    );
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = { ...this.preferences, ...updates };
    
    if (!this.validatePreferences(newPreferences)) {
      return false;
    }

    this.preferences = newPreferences;
    this.savePreferences();
    return true;
  }

  private savePreferences(): void {
    localStorage.setItem(
      UserPreferencesManager.STORAGE_KEY,
      JSON.stringify(this.preferences)
    );
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(defaults: UserPreferences): void {
    this.preferences = defaults;
    this.savePreferences();
  }
}

const defaultPreferences: UserPreferences = {
  theme: 'auto',
  language: 'en-US',
  notificationsEnabled: true,
  fontSize: 14
};

export const userPrefsManager = new UserPreferencesManager(defaultPreferences);