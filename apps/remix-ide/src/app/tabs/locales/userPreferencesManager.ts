interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return this.getDefaultPreferences();
      }
    }
    return this.getDefaultPreferences();
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 14
    };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
    this.validatePreferences();
    this.savePreferences();
  }

  private validatePreferences(): void {
    if (this.preferences.fontSize < 8 || this.preferences.fontSize > 32) {
      throw new Error('Font size must be between 8 and 32');
    }

    const validThemes = ['light', 'dark', 'auto'];
    if (!validThemes.includes(this.preferences.theme)) {
      throw new Error(`Invalid theme. Must be one of: ${validThemes.join(', ')}`);
    }
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

  resetToDefaults(): void {
    this.preferences = this.getDefaultPreferences();
    this.savePreferences();
  }
}

export { UserPreferencesManager, type UserPreferences };
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  fontSize: 16
};

const VALID_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 32;

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
      console.warn('Failed to load preferences from storage:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private validatePreferences(prefs: any): UserPreferences {
    const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

    if (prefs.theme && ['light', 'dark', 'auto'].includes(prefs.theme)) {
      validated.theme = prefs.theme;
    }

    if (typeof prefs.notifications === 'boolean') {
      validated.notifications = prefs.notifications;
    }

    if (prefs.language && VALID_LANGUAGES.includes(prefs.language)) {
      validated.language = prefs.language;
    }

    if (typeof prefs.fontSize === 'number') {
      validated.fontSize = Math.max(
        MIN_FONT_SIZE,
        Math.min(MAX_FONT_SIZE, prefs.fontSize)
      );
    }

    return validated;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = { ...this.preferences, ...updates };
    const validated = this.validatePreferences(newPreferences);

    if (JSON.stringify(validated) !== JSON.stringify(this.preferences)) {
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
      console.error('Failed to save preferences:', error);
    }
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  getTheme(): 'light' | 'dark' {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
    }
    return this.preferences.theme;
  }

  isNotificationEnabled(): boolean {
    return this.preferences.notifications && 
           Notification.permission === 'granted';
  }
}

export const preferencesManager = new UserPreferencesManager();interface UserPreferences {
  theme: 'light' | 'dark';
  fontSize: number;
  notificationsEnabled: boolean;
  language: string;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;
  private listeners: Set<(prefs: UserPreferences) => void> = new Set();

  constructor(defaultPreferences: UserPreferences) {
    const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
    this.preferences = stored ? JSON.parse(stored) : defaultPreferences;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
    localStorage.setItem(UserPreferencesManager.STORAGE_KEY, JSON.stringify(this.preferences));
    this.notifyListeners();
  }

  resetToDefaults(defaults: UserPreferences): void {
    this.preferences = defaults;
    localStorage.removeItem(UserPreferencesManager.STORAGE_KEY);
    this.notifyListeners();
  }

  subscribe(listener: (prefs: UserPreferences) => void): () => void {
    this.listeners.add(listener);
    listener(this.getPreferences());
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const currentPrefs = this.getPreferences();
    this.listeners.forEach(listener => listener(currentPrefs));
  }
}

const defaultUserPreferences: UserPreferences = {
  theme: 'light',
  fontSize: 16,
  notificationsEnabled: true,
  language: 'en-US'
};

export const userPrefsManager = new UserPreferencesManager(defaultUserPreferences);interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notificationsEnabled: boolean;
  itemsPerPage: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  language: 'en',
  notificationsEnabled: true,
  itemsPerPage: 25
};

class UserPreferencesManager {
  private static STORAGE_KEY = 'app_user_preferences';

  static loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  static savePreferences(prefs: Partial<UserPreferences>): void {
    try {
      const current = this.loadPreferences();
      const updated = { ...current, ...prefs };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }

  static resetToDefaults(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to reset preferences:', error);
    }
  }

  static getPreference<K extends keyof UserPreferences>(key: K): UserPreferences[K] {
    const prefs = this.loadPreferences();
    return prefs[key];
  }
}

export { UserPreferencesManager, DEFAULT_PREFERENCES };
export type { UserPreferences };