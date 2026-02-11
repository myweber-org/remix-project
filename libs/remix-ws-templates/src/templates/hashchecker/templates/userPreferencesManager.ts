
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  fontSize: number;
  language: string;
}

class UserPreferencesManager {
  private static readonly DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    notifications: true,
    fontSize: 16,
    language: 'en-US'
  };

  private static readonly VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
  private static readonly MIN_FONT_SIZE = 8;
  private static readonly MAX_FONT_SIZE = 32;

  private preferences: UserPreferences;

  constructor(initialPreferences?: Partial<UserPreferences>) {
    this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES, ...initialPreferences };
    this.validateAndNormalize();
  }

  private validateAndNormalize(): void {
    if (!['light', 'dark', 'auto'].includes(this.preferences.theme)) {
      this.preferences.theme = UserPreferencesManager.DEFAULT_PREFERENCES.theme;
    }

    if (typeof this.preferences.notifications !== 'boolean') {
      this.preferences.notifications = UserPreferencesManager.DEFAULT_PREFERENCES.notifications;
    }

    if (typeof this.preferences.fontSize !== 'number' || 
        this.preferences.fontSize < UserPreferencesManager.MIN_FONT_SIZE || 
        this.preferences.fontSize > UserPreferencesManager.MAX_FONT_SIZE) {
      this.preferences.fontSize = UserPreferencesManager.DEFAULT_PREFERENCES.fontSize;
    }

    if (!UserPreferencesManager.VALID_LANGUAGES.includes(this.preferences.language)) {
      this.preferences.language = UserPreferencesManager.DEFAULT_PREFERENCES.language;
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
    this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
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

export { UserPreferencesManager, type UserPreferences };typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    fontSize: number;
}

class UserPreferencesManager {
    private static readonly STORAGE_KEY = 'user_preferences';
    private static readonly DEFAULT_PREFERENCES: UserPreferences = {
        theme: 'auto',
        notifications: true,
        language: 'en-US',
        fontSize: 16
    };

    private preferences: UserPreferences;

    constructor() {
        this.preferences = this.loadPreferences();
    }

    private loadPreferences(): UserPreferences {
        try {
            const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return this.validatePreferences(parsed);
            }
        } catch (error) {
            console.warn('Failed to load preferences from storage:', error);
        }
        return { ...UserPreferencesManager.DEFAULT_PREFERENCES };
    }

    private validatePreferences(data: unknown): UserPreferences {
        const defaultPrefs = UserPreferencesManager.DEFAULT_PREFERENCES;
        
        if (!data || typeof data !== 'object') {
            return { ...defaultPrefs };
        }

        const prefs = data as Record<string, unknown>;
        
        return {
            theme: this.isValidTheme(prefs.theme) ? prefs.theme : defaultPrefs.theme,
            notifications: typeof prefs.notifications === 'boolean' 
                ? prefs.notifications 
                : defaultPrefs.notifications,
            language: typeof prefs.language === 'string' 
                ? prefs.language 
                : defaultPrefs.language,
            fontSize: typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 32
                ? prefs.fontSize
                : defaultPrefs.fontSize
        };
    }

    private isValidTheme(theme: unknown): theme is UserPreferences['theme'] {
        return theme === 'light' || theme === 'dark' || theme === 'auto';
    }

    getPreferences(): Readonly<UserPreferences> {
        return { ...this.preferences };
    }

    updatePreferences(updates: Partial<UserPreferences>): boolean {
        const newPreferences = { ...this.preferences, ...updates };
        
        if (!this.validateUpdate(newPreferences)) {
            return false;
        }

        this.preferences = newPreferences;
        this.savePreferences();
        return true;
    }

    private validateUpdate(preferences: UserPreferences): boolean {
        return (
            this.isValidTheme(preferences.theme) &&
            typeof preferences.notifications === 'boolean' &&
            typeof preferences.language === 'string' &&
            typeof preferences.fontSize === 'number' &&
            preferences.fontSize >= 8 &&
            preferences.fontSize <= 32
        );
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

    resetToDefaults(): void {
        this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
        this.savePreferences();
    }

    hasUnsavedChanges(): boolean {
        const saved = this.loadPreferences();
        return JSON.stringify(this.preferences) !== JSON.stringify(saved);
    }
}

export { UserPreferencesManager, type UserPreferences };
```