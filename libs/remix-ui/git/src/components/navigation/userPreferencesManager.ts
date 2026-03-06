interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor(defaultPreferences?: Partial<UserPreferences>) {
    this.preferences = this.loadPreferences();
    if (defaultPreferences) {
      this.preferences = { ...this.preferences, ...defaultPreferences };
    }
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage:', error);
    }

    return this.getDefaultPreferences();
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      notifications: true,
      language: 'en-US',
      fontSize: 16
    };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const previous = { ...this.preferences };
    this.preferences = { ...this.preferences, ...updates };

    if (!this.validatePreferences(this.preferences)) {
      this.preferences = previous;
      throw new Error('Invalid preferences provided');
    }

    this.savePreferences();
  }

  private validatePreferences(prefs: UserPreferences): boolean {
    const validThemes = ['light', 'dark', 'auto'];
    if (!validThemes.includes(prefs.theme)) {
      return false;
    }

    if (typeof prefs.notifications !== 'boolean') {
      return false;
    }

    if (typeof prefs.language !== 'string' || prefs.language.length < 2) {
      return false;
    }

    if (typeof prefs.fontSize !== 'number' || prefs.fontSize < 8 || prefs.fontSize > 72) {
      return false;
    }

    return true;
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

export { UserPreferencesManager, type UserPreferences };
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

  constructor(initialPreferences?: Partial<UserPreferences>) {
    this.preferences = { ...DEFAULT_PREFERENCES, ...initialPreferences };
    this.validateAndNormalize();
  }

  private validateAndNormalize(): void {
    if (!['light', 'dark', 'auto'].includes(this.preferences.theme)) {
      this.preferences.theme = DEFAULT_PREFERENCES.theme;
    }

    if (typeof this.preferences.notifications !== 'boolean') {
      this.preferences.notifications = DEFAULT_PREFERENCES.notifications;
    }

    if (typeof this.preferences.fontSize !== 'number' || 
        this.preferences.fontSize < 8 || 
        this.preferences.fontSize > 32) {
      this.preferences.fontSize = DEFAULT_PREFERENCES.fontSize;
    }

    if (!VALID_LANGUAGES.includes(this.preferences.language)) {
      this.preferences.language = DEFAULT_PREFERENCES.language;
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
    this.validateAndNormalize();
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
  }

  exportAsJSON(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  static importFromJSON(jsonString: string): UserPreferencesManager {
    try {
      const parsed = JSON.parse(jsonString);
      return new UserPreferencesManager(parsed);
    } catch {
      return new UserPreferencesManager();
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

  updatePreferences(updates: Partial<UserPreferences>): void {
    const validated = this.validateUpdates(updates);
    this.preferences = { ...this.preferences, ...validated };
    this.savePreferences();
  }

  private validateUpdates(updates: Partial<UserPreferences>): Partial<UserPreferences> {
    const validated: Partial<UserPreferences> = {};

    if (updates.theme && ['light', 'dark', 'auto'].includes(updates.theme)) {
      validated.theme = updates.theme;
    }

    if (typeof updates.notifications === 'boolean') {
      validated.notifications = updates.notifications;
    }

    if (updates.language && typeof updates.language === 'string') {
      validated.language = updates.language;
    }

    if (updates.fontSize && updates.fontSize >= 12 && updates.fontSize <= 24) {
      validated.fontSize = updates.fontSize;
    }

    return validated;
  }

  private savePreferences(): void {
    localStorage.setItem(
      UserPreferencesManager.STORAGE_KEY,
      JSON.stringify(this.preferences)
    );
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  resetToDefaults(defaults: UserPreferences): void {
    this.preferences = { ...defaults };
    this.savePreferences();
  }
}

const defaultPrefs: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  fontSize: 16
};

export const userPrefsManager = new UserPreferencesManager(defaultPrefs);