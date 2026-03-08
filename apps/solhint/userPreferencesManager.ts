
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  fontSize: 14
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 32;

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
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

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  private validatePreferences(prefs: UserPreferences): boolean {
    if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
      return false;
    }

    if (typeof prefs.notifications !== 'boolean') {
      return false;
    }

    if (!VALID_LANGUAGES.includes(prefs.language)) {
      return false;
    }

    if (typeof prefs.fontSize !== 'number' || 
        prefs.fontSize < MIN_FONT_SIZE || 
        prefs.fontSize > MAX_FONT_SIZE) {
      return false;
    }

    return true;
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem('userPreferences');
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validatePreferences(parsed) ? parsed : { ...DEFAULT_PREFERENCES };
      }
    } catch (error) {
      console.warn('Failed to load preferences:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private savePreferences(): void {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }
}

export { UserPreferencesManager, type UserPreferences };interface UserPreferences {
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

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = { ...this.preferences, ...updates };
    
    if (!this.validatePreferences(newPreferences)) {
      return false;
    }

    this.preferences = newPreferences;
    this.savePreferences();
    return true;
  }

  private validatePreferences(prefs: UserPreferences): boolean {
    return (
      ['light', 'dark', 'auto'].includes(prefs.theme) &&
      typeof prefs.notifications === 'boolean' &&
      typeof prefs.language === 'string' &&
      prefs.language.length >= 2 &&
      prefs.fontSize >= 8 &&
      prefs.fontSize <= 32
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

export { UserPreferencesManager, type UserPreferences };interface UserPreferences {
  theme: 'light' | 'dark';
  fontSize: number;
  notificationsEnabled: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  fontSize: 14,
  notificationsEnabled: true
};

class UserPreferencesManager {
  private readonly storageKey = 'userPreferences';

  getPreferences(): UserPreferences {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
      } catch {
        return DEFAULT_PREFERENCES;
      }
    }
    return DEFAULT_PREFERENCES;
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const current = this.getPreferences();
    const updated = { ...current, ...updates };
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }

  resetToDefaults(): void {
    localStorage.removeItem(this.storageKey);
  }

  hasStoredPreferences(): boolean {
    return localStorage.getItem(this.storageKey) !== null;
  }
}

export const preferencesManager = new UserPreferencesManager();
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  fontSize: number;
  notificationsEnabled: boolean;
  language: string;
}

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
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
    this.savePreferences();
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  getPreference<K extends keyof UserPreferences>(key: K): UserPreferences[K] {
    return this.preferences[key];
  }
}

export const userPreferences = new UserPreferencesManager();