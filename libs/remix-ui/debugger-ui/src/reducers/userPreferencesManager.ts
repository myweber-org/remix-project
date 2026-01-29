typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    resultsPerPage: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en-US',
    resultsPerPage: 20
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
const MIN_RESULTS_PER_PAGE = 10;
const MAX_RESULTS_PER_PAGE = 100;

class UserPreferencesManager {
    private preferences: UserPreferences;

    constructor(initialPreferences?: Partial<UserPreferences>) {
        this.preferences = { ...DEFAULT_PREFERENCES, ...initialPreferences };
        this.validateAndSanitize();
    }

    private validateAndSanitize(): void {
        if (!['light', 'dark', 'auto'].includes(this.preferences.theme)) {
            this.preferences.theme = DEFAULT_PREFERENCES.theme;
        }

        if (typeof this.preferences.notifications !== 'boolean') {
            this.preferences.notifications = DEFAULT_PREFERENCES.notifications;
        }

        if (!VALID_LANGUAGES.includes(this.preferences.language)) {
            this.preferences.language = DEFAULT_PREFERENCES.language;
        }

        if (typeof this.preferences.resultsPerPage !== 'number' || 
            this.preferences.resultsPerPage < MIN_RESULTS_PER_PAGE || 
            this.preferences.resultsPerPage > MAX_RESULTS_PER_PAGE) {
            this.preferences.resultsPerPage = DEFAULT_PREFERENCES.resultsPerPage;
        }
    }

    updatePreferences(updates: Partial<UserPreferences>): void {
        this.preferences = { ...this.preferences, ...updates };
        this.validateAndSanitize();
    }

    getPreferences(): Readonly<UserPreferences> {
        return { ...this.preferences };
    }

    resetToDefaults(): void {
        this.preferences = { ...DEFAULT_PREFERENCES };
    }

    exportAsJSON(): string {
        return JSON.stringify(this.preferences);
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

export { UserPreferencesManager, type UserPreferences };
```interface UserPreferences {
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
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid preferences data');
    }

    const prefs = data as Record<string, unknown>;
    
    return {
      theme: this.validateTheme(prefs.theme),
      notifications: this.validateBoolean(prefs.notifications, DEFAULT_PREFERENCES.notifications),
      language: this.validateString(prefs.language, DEFAULT_PREFERENCES.language),
      fontSize: this.validateNumber(prefs.fontSize, DEFAULT_PREFERENCES.fontSize)
    };
  }

  private validateTheme(theme: unknown): UserPreferences['theme'] {
    if (theme === 'light' || theme === 'dark' || theme === 'auto') {
      return theme;
    }
    return DEFAULT_PREFERENCES.theme;
  }

  private validateBoolean(value: unknown, defaultValue: boolean): boolean {
    return typeof value === 'boolean' ? value : defaultValue;
  }

  private validateString(value: unknown, defaultValue: string): string {
    return typeof value === 'string' && value.trim().length > 0 ? value.trim() : defaultValue;
  }

  private validateNumber(value: unknown, defaultValue: number): number {
    const num = Number(value);
    return !isNaN(num) && num > 0 ? num : defaultValue;
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
      validatedUpdates.notifications = this.validateBoolean(updates.notifications, this.preferences.notifications);
    }
    
    if (updates.language !== undefined) {
      validatedUpdates.language = this.validateString(updates.language, this.preferences.language);
    }
    
    if (updates.fontSize !== undefined) {
      validatedUpdates.fontSize = this.validateNumber(updates.fontSize, this.preferences.fontSize);
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

export const preferencesManager = new UserPreferencesManager();