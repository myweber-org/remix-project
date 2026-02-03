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
        return this.validatePreferences(JSON.parse(stored));
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

  private validatePreferences(data: any): UserPreferences {
    const validThemes = ['light', 'dark', 'auto'];
    const defaultPrefs = this.getDefaultPreferences();

    return {
      theme: validThemes.includes(data.theme) ? data.theme : defaultPrefs.theme,
      notifications: typeof data.notifications === 'boolean' ? data.notifications : defaultPrefs.notifications,
      language: typeof data.language === 'string' ? data.language : defaultPrefs.language,
      fontSize: typeof data.fontSize === 'number' && data.fontSize >= 8 && data.fontSize <= 24 
        ? data.fontSize 
        : defaultPrefs.fontSize
    };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = {
      ...this.preferences,
      ...this.validatePreferences(updates)
    };
    this.savePreferences();
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

  isDarkMode(): boolean {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.preferences.theme === 'dark';
  }
}

export { UserPreferencesManager, type UserPreferences };import { EventEmitter } from 'events';

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

export class UserPreferencesManager extends EventEmitter {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor(defaultPreferences: UserPreferences) {
    super();
    this.preferences = this.loadPreferences() || defaultPreferences;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const previous = { ...this.preferences };
    this.preferences = { ...this.preferences, ...updates };
    
    this.savePreferences();
    
    const changedKeys = Object.keys(updates) as (keyof UserPreferences)[];
    changedKeys.forEach(key => {
      if (previous[key] !== this.preferences[key]) {
        this.emit(`preferenceChanged:${key}`, this.preferences[key], previous[key]);
      }
    });
    
    this.emit('preferencesUpdated', this.preferences, previous);
  }

  resetToDefaults(defaults: UserPreferences): void {
    this.preferences = { ...defaults };
    this.savePreferences();
    this.emit('preferencesReset', this.preferences);
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
    try {
      localStorage.setItem(
        UserPreferencesManager.STORAGE_KEY,
        JSON.stringify(this.preferences)
      );
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }
}