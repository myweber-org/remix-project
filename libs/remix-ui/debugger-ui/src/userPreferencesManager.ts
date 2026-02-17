interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en-US',
  notificationsEnabled: true,
  fontSize: 14
};

class UserPreferencesManager {
  private readonly STORAGE_KEY = 'user_preferences';

  getPreferences(): UserPreferences {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    
    if (!stored) {
      return this.savePreferences(DEFAULT_PREFERENCES);
    }

    try {
      const parsed = JSON.parse(stored);
      return this.validateAndMergePreferences(parsed);
    } catch {
      return this.savePreferences(DEFAULT_PREFERENCES);
    }
  }

  savePreferences(preferences: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const merged = { ...current, ...preferences };
    const validated = this.validatePreferences(merged);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(validated));
    return validated;
  }

  resetToDefaults(): UserPreferences {
    return this.savePreferences(DEFAULT_PREFERENCES);
  }

  private validatePreferences(prefs: UserPreferences): UserPreferences {
    return {
      theme: ['light', 'dark', 'auto'].includes(prefs.theme) ? prefs.theme : DEFAULT_PREFERENCES.theme,
      language: typeof prefs.language === 'string' ? prefs.language : DEFAULT_PREFERENCES.language,
      notificationsEnabled: typeof prefs.notificationsEnabled === 'boolean' 
        ? prefs.notificationsEnabled 
        : DEFAULT_PREFERENCES.notificationsEnabled,
      fontSize: typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 32
        ? prefs.fontSize
        : DEFAULT_PREFERENCES.fontSize
    };
  }

  private validateAndMergePreferences(parsed: unknown): UserPreferences {
    if (typeof parsed !== 'object' || parsed === null) {
      return DEFAULT_PREFERENCES;
    }

    const partialPrefs: Partial<UserPreferences> = {};
    const raw = parsed as Record<string, unknown>;

    if (['light', 'dark', 'auto'].includes(raw.theme as string)) {
      partialPrefs.theme = raw.theme as UserPreferences['theme'];
    }

    if (typeof raw.language === 'string') {
      partialPrefs.language = raw.language;
    }

    if (typeof raw.notificationsEnabled === 'boolean') {
      partialPrefs.notificationsEnabled = raw.notificationsEnabled;
    }

    if (typeof raw.fontSize === 'number' && raw.fontSize >= 8 && raw.fontSize <= 32) {
      partialPrefs.fontSize = raw.fontSize;
    }

    return { ...DEFAULT_PREFERENCES, ...partialPrefs };
  }
}

export const userPreferences = new UserPreferencesManager();interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor(defaultPreferences?: Partial<UserPreferences>) {
    this.preferences = this.loadPreferences() || this.getDefaultPreferences();
    
    if (defaultPreferences) {
      this.preferences = { ...this.preferences, ...defaultPreferences };
    }
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      language: 'en-US',
      notificationsEnabled: true,
      fontSize: 14
    };
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

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = { ...this.preferences, ...updates };
    
    if (this.validatePreferences(newPreferences)) {
      this.preferences = newPreferences;
      this.savePreferences();
      return true;
    }
    
    return false;
  }

  private validatePreferences(prefs: UserPreferences): boolean {
    const validThemes = ['light', 'dark', 'auto'];
    const minFontSize = 8;
    const maxFontSize = 32;

    return (
      validThemes.includes(prefs.theme) &&
      typeof prefs.language === 'string' &&
      prefs.language.length >= 2 &&
      typeof prefs.notificationsEnabled === 'boolean' &&
      prefs.fontSize >= minFontSize &&
      prefs.fontSize <= maxFontSize
    );
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = this.getDefaultPreferences();
    this.savePreferences();
  }

  hasStoredPreferences(): boolean {
    return localStorage.getItem(UserPreferencesManager.STORAGE_KEY) !== null;
  }
}

export { UserPreferencesManager, type UserPreferences };