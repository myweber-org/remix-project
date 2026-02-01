
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  fontSize: number;
  language: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  fontSize: 16,
  language: 'en-US'
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    const stored = localStorage.getItem('userPreferences');
    if (!stored) return { ...DEFAULT_PREFERENCES };

    try {
      const parsed = JSON.parse(stored);
      return this.validatePreferences(parsed);
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  }

  private validatePreferences(data: any): UserPreferences {
    const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

    if (data.theme && ['light', 'dark', 'auto'].includes(data.theme)) {
      validated.theme = data.theme;
    }

    if (typeof data.notifications === 'boolean') {
      validated.notifications = data.notifications;
    }

    if (typeof data.fontSize === 'number' && data.fontSize >= 12 && data.fontSize <= 24) {
      validated.fontSize = data.fontSize;
    }

    if (data.language && VALID_LANGUAGES.includes(data.language)) {
      validated.language = data.language;
    }

    return validated;
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = { ...this.preferences, ...updates };
    const validated = this.validatePreferences(newPreferences);

    if (this.arePreferencesEqual(this.preferences, validated)) {
      return false;
    }

    this.preferences = validated;
    this.savePreferences();
    return true;
  }

  private arePreferencesEqual(a: UserPreferences, b: UserPreferences): boolean {
    return a.theme === b.theme &&
           a.notifications === b.notifications &&
           a.fontSize === b.fontSize &&
           a.language === b.language;
  }

  private savePreferences(): void {
    localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }
}

export const preferencesManager = new UserPreferencesManager();interface UserPreferences {
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
      fontSize: 16
    };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
    this.validatePreferences();
    this.savePreferences();
  }

  private validatePreferences(): void {
    if (!['light', 'dark', 'auto'].includes(this.preferences.theme)) {
      this.preferences.theme = 'auto';
    }
    if (typeof this.preferences.notifications !== 'boolean') {
      this.preferences.notifications = true;
    }
    if (typeof this.preferences.fontSize !== 'number' || this.preferences.fontSize < 8 || this.preferences.fontSize > 32) {
      this.preferences.fontSize = 16;
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