import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  language: z.string().min(2).default('en'),
  notificationsEnabled: z.boolean().default(true),
  fontSize: z.number().min(8).max(32).default(14),
  autoSaveInterval: z.number().min(0).max(300).default(30)
});

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

const STORAGE_KEY = 'app_user_preferences';

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return UserPreferencesSchema.parse(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences, using defaults:', error);
    }
    return UserPreferencesSchema.parse({});
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    try {
      const newPreferences = { ...this.preferences, ...updates };
      const validated = UserPreferencesSchema.parse(newPreferences);
      this.preferences = validated;
      this.savePreferences();
      return true;
    } catch (error) {
      console.error('Invalid preferences update:', error);
      return false;
    }
  }

  resetToDefaults(): void {
    this.preferences = UserPreferencesSchema.parse({});
    this.savePreferences();
  }

  exportPreferences(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  importPreferences(json: string): boolean {
    try {
      const parsed = JSON.parse(json);
      const validated = UserPreferencesSchema.parse(parsed);
      this.preferences = validated;
      this.savePreferences();
      return true;
    } catch (error) {
      console.error('Failed to import preferences:', error);
      return false;
    }
  }
}

export const userPreferencesManager = new UserPreferencesManager();interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
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

  updatePreferences(updates: Partial<UserPreferences>): void {
    const newPreferences = { ...this.preferences, ...updates };
    
    if (this.validatePreferences(newPreferences)) {
      this.preferences = newPreferences;
      this.savePreferences();
    } else {
      throw new Error('Invalid preferences provided');
    }
  }

  private validatePreferences(prefs: UserPreferences): boolean {
    const validThemes = ['light', 'dark', 'auto'];
    return (
      validThemes.includes(prefs.theme) &&
      typeof prefs.notifications === 'boolean' &&
      typeof prefs.language === 'string' &&
      prefs.language.length >= 2 &&
      typeof prefs.fontSize === 'number' &&
      prefs.fontSize >= 8 &&
      prefs.fontSize <= 72
    );
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

const defaultPrefs: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  fontSize: 16
};

export const userPrefsManager = new UserPreferencesManager(defaultPrefs);typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en-US',
  notifications: true,
  fontSize: 14
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 24;

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem('userPreferences');
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validatePreferences(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private validatePreferences(prefs: any): UserPreferences {
    const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

    if (typeof prefs.theme === 'string' && ['light', 'dark', 'auto'].includes(prefs.theme)) {
      validated.theme = prefs.theme as UserPreferences['theme'];
    }

    if (typeof prefs.language === 'string' && VALID_LANGUAGES.includes(prefs.language)) {
      validated.language = prefs.language;
    }

    if (typeof prefs.notifications === 'boolean') {
      validated.notifications = prefs.notifications;
    }

    if (typeof prefs.fontSize === 'number') {
      validated.fontSize = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, prefs.fontSize));
    }

    return validated;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = { ...this.preferences, ...updates };
    const validated = this.validatePreferences(newPreferences);

    if (JSON.stringify(this.preferences) !== JSON.stringify(validated)) {
      this.preferences = validated;
      this.savePreferences();
      return true;
    }
    return false;
  }

  private savePreferences(): void {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences to storage', error);
    }
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  isDarkMode(): boolean {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.preferences.theme === 'dark';
  }
}

export const preferencesManager = new UserPreferencesManager();
```