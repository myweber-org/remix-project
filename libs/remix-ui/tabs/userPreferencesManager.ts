
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
    
    if (!stored) {
      return { ...DEFAULT_PREFERENCES };
    }

    try {
      const parsed = JSON.parse(stored);
      return this.validateAndMerge(parsed);
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  }

  private validateAndMerge(partialPrefs: Partial<UserPreferences>): UserPreferences {
    const merged = { ...DEFAULT_PREFERENCES, ...partialPrefs };

    if (!['light', 'dark', 'auto'].includes(merged.theme)) {
      merged.theme = DEFAULT_PREFERENCES.theme;
    }

    if (typeof merged.notifications !== 'boolean') {
      merged.notifications = DEFAULT_PREFERENCES.notifications;
    }

    if (typeof merged.fontSize !== 'number' || merged.fontSize < 8 || merged.fontSize > 32) {
      merged.fontSize = DEFAULT_PREFERENCES.fontSize;
    }

    if (!VALID_LANGUAGES.includes(merged.language)) {
      merged.language = DEFAULT_PREFERENCES.language;
    }

    return merged;
  }

  updatePreferences(newPreferences: Partial<UserPreferences>): boolean {
    const validated = this.validateAndMerge(newPreferences);
    
    if (JSON.stringify(this.preferences) === JSON.stringify(validated)) {
      return false;
    }

    this.preferences = validated;
    this.savePreferences();
    return true;
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

  getTheme(): string {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return this.preferences.theme;
  }
}

export const preferencesManager = new UserPreferencesManager();typescript
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

    private validatePreferences(data: any): UserPreferences {
        const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

        if (data.theme && ['light', 'dark', 'auto'].includes(data.theme)) {
            validated.theme = data.theme;
        }

        if (typeof data.notifications === 'boolean') {
            validated.notifications = data.notifications;
        }

        if (typeof data.language === 'string' && data.language.length >= 2) {
            validated.language = data.language;
        }

        if (typeof data.fontSize === 'number' && data.fontSize >= 8 && data.fontSize <= 32) {
            validated.fontSize = data.fontSize;
        }

        return validated;
    }

    getPreferences(): UserPreferences {
        return { ...this.preferences };
    }

    updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
        const newPreferences = { ...this.preferences, ...updates };
        this.preferences = this.validatePreferences(newPreferences);
        this.savePreferences();
        return this.getPreferences();
    }

    private savePreferences(): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
        } catch (error) {
            console.error('Failed to save preferences:', error);
        }
    }

    resetToDefaults(): UserPreferences {
        this.preferences = { ...DEFAULT_PREFERENCES };
        this.savePreferences();
        return this.getPreferences();
    }

    hasCustomPreferences(): boolean {
        return JSON.stringify(this.preferences) !== JSON.stringify(DEFAULT_PREFERENCES);
    }
}

export const userPreferences = new UserPreferencesManager();
```