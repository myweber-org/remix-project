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

const STORAGE_KEY = 'user_preferences';

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
        return this.validatePreferences(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private validatePreferences(data: unknown): UserPreferences {
    if (!data || typeof data !== 'object') {
      return { ...DEFAULT_PREFERENCES };
    }

    const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

    if ('theme' in data && ['light', 'dark', 'auto'].includes(data.theme as string)) {
      validated.theme = data.theme as UserPreferences['theme'];
    }

    if ('notifications' in data && typeof data.notifications === 'boolean') {
      validated.notifications = data.notifications;
    }

    if ('language' in data && typeof data.language === 'string') {
      validated.language = data.language;
    }

    if ('fontSize' in data && typeof data.fontSize === 'number' && data.fontSize >= 8 && data.fontSize <= 32) {
      validated.fontSize = data.fontSize;
    }

    return validated;
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  getTheme(): UserPreferences['theme'] {
    return this.preferences.theme;
  }

  toggleNotifications(): void {
    this.updatePreferences({ notifications: !this.preferences.notifications });
  }
}

export const userPreferences = new UserPreferencesManager();interface UserPreferences {
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
        const parsed = JSON.parse(stored);
        if (this.validatePreferences(parsed)) {
          return parsed;
        }
      } catch (error) {
        console.warn('Failed to parse stored preferences', error);
      }
    }
    return this.getDefaultPreferences();
  }

  private validatePreferences(data: unknown): data is UserPreferences {
    if (!data || typeof data !== 'object') return false;
    
    const prefs = data as Record<string, unknown>;
    return (
      ['light', 'dark', 'auto'].includes(prefs.theme as string) &&
      typeof prefs.notifications === 'boolean' &&
      typeof prefs.language === 'string' &&
      typeof prefs.fontSize === 'number' &&
      prefs.fontSize >= 8 &&
      prefs.fontSize <= 32
    );
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      notifications: true,
      language: 'en-US',
      fontSize: 14
    };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const newPreferences = { ...this.preferences, ...updates };
    
    if (this.validatePreferences(newPreferences)) {
      this.preferences = newPreferences;
      this.savePreferences();
    } else {
      throw new Error('Invalid preferences data');
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

  getTheme(): UserPreferences['theme'] {
    return this.preferences.theme;
  }

  isNotificationsEnabled(): boolean {
    return this.preferences.notifications;
  }
}

export { UserPreferencesManager, type UserPreferences };