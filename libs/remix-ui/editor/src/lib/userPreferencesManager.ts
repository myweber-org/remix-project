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

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    const stored = localStorage.getItem('userPreferences');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return this.validatePreferences(parsed);
      } catch {
        return { ...DEFAULT_PREFERENCES };
      }
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private validatePreferences(data: unknown): UserPreferences {
    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid preferences data');
    }

    const prefs = data as Record<string, unknown>;
    
    return {
      theme: this.validateTheme(prefs.theme),
      notifications: this.validateBoolean(prefs.notifications),
      language: this.validateString(prefs.language),
      fontSize: this.validateFontSize(prefs.fontSize)
    };
  }

  private validateTheme(theme: unknown): UserPreferences['theme'] {
    if (theme === 'light' || theme === 'dark' || theme === 'auto') {
      return theme;
    }
    return DEFAULT_PREFERENCES.theme;
  }

  private validateBoolean(value: unknown): boolean {
    return typeof value === 'boolean' ? value : DEFAULT_PREFERENCES.notifications;
  }

  private validateString(value: unknown): string {
    return typeof value === 'string' && value.length > 0 ? value : DEFAULT_PREFERENCES.language;
  }

  private validateFontSize(value: unknown): number {
    const num = Number(value);
    return !isNaN(num) && num >= 8 && num <= 32 ? num : DEFAULT_PREFERENCES.fontSize;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const validatedUpdates: Partial<UserPreferences> = {};

    if (updates.theme !== undefined) {
      validatedUpdates.theme = this.validateTheme(updates.theme);
    }
    
    if (updates.notifications !== undefined) {
      validatedUpdates.notifications = this.validateBoolean(updates.notifications);
    }
    
    if (updates.language !== undefined) {
      validatedUpdates.language = this.validateString(updates.language);
    }
    
    if (updates.fontSize !== undefined) {
      validatedUpdates.fontSize = this.validateFontSize(updates.fontSize);
    }

    this.preferences = { ...this.preferences, ...validatedUpdates };
    this.savePreferences();
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  private savePreferences(): void {
    localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
  }
}

export const preferencesManager = new UserPreferencesManager();interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en',
  notificationsEnabled: true,
  fontSize: 14
};

class UserPreferencesManager {
  private preferences: UserPreferences;
  private readonly storageKey = 'user_preferences';

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validatePreferences(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private validatePreferences(data: unknown): UserPreferences {
    const result = { ...DEFAULT_PREFERENCES };

    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;

      if (obj.theme && ['light', 'dark', 'auto'].includes(obj.theme as string)) {
        result.theme = obj.theme as UserPreferences['theme'];
      }

      if (obj.language && typeof obj.language === 'string') {
        result.language = obj.language;
      }

      if (typeof obj.notificationsEnabled === 'boolean') {
        result.notificationsEnabled = obj.notificationsEnabled;
      }

      if (typeof obj.fontSize === 'number' && obj.fontSize >= 8 && obj.fontSize <= 32) {
        result.fontSize = obj.fontSize;
      }
    }

    return result;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const newPreferences = { ...this.preferences, ...updates };
    this.preferences = this.validatePreferences(newPreferences);
    this.savePreferences();
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  exportPreferences(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  importPreferences(json: string): boolean {
    try {
      const parsed = JSON.parse(json);
      this.preferences = this.validatePreferences(parsed);
      this.savePreferences();
      return true;
    } catch {
      return false;
    }
  }
}

export const userPreferences = new UserPreferencesManager();