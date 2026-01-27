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
}