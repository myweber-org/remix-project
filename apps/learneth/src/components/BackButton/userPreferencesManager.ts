typescript
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
const MAX_FONT_SIZE = 24;

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem('userPreferences');
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validatePreferences(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private validatePreferences(prefs: any): UserPreferences {
    const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

    if (prefs.theme && ['light', 'dark', 'auto'].includes(prefs.theme)) {
      validated.theme = prefs.theme;
    }

    if (typeof prefs.notifications === 'boolean') {
      validated.notifications = prefs.notifications;
    }

    if (prefs.language && VALID_LANGUAGES.includes(prefs.language)) {
      validated.language = prefs.language;
    }

    if (typeof prefs.fontSize === 'number') {
      validated.fontSize = Math.max(MIN_FONT_SIZE, 
        Math.min(MAX_FONT_SIZE, prefs.fontSize));
    }

    return validated;
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = { ...this.preferences, ...updates };
    const validated = this.validatePreferences(newPreferences);

    try {
      localStorage.setItem('userPreferences', JSON.stringify(validated));
      this.preferences = validated;
      this.applyPreferences();
      return true;
    } catch (error) {
      console.error('Failed to save preferences:', error);
      return false;
    }
  }

  private applyPreferences(): void {
    document.documentElement.setAttribute('data-theme', this.preferences.theme);
    document.documentElement.style.fontSize = `${this.preferences.fontSize}px`;
    
    if (this.preferences.language) {
      document.documentElement.lang = this.preferences.language;
    }
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.updatePreferences(DEFAULT_PREFERENCES);
  }

  exportPreferences(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  importPreferences(json: string): boolean {
    try {
      const parsed = JSON.parse(json);
      return this.updatePreferences(parsed);
    } catch (error) {
      console.error('Invalid preferences JSON:', error);
      return false;
    }
  }
}

export const preferencesManager = new UserPreferencesManager();
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

  constructor(initialPreferences?: Partial<UserPreferences>) {
    this.preferences = { ...DEFAULT_PREFERENCES, ...initialPreferences };
    this.validatePreferences();
  }

  private validatePreferences(): void {
    if (!['light', 'dark', 'auto'].includes(this.preferences.theme)) {
      throw new Error('Invalid theme value');
    }
    if (typeof this.preferences.notifications !== 'boolean') {
      throw new Error('Notifications must be boolean');
    }
    if (this.preferences.fontSize < 8 || this.preferences.fontSize > 32) {
      throw new Error('Font size must be between 8 and 32');
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const newPreferences = { ...this.preferences, ...updates };
    this.preferences = newPreferences;
    this.validatePreferences();
    this.saveToStorage();
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.saveToStorage();
  }

  private saveToStorage(): void {
    localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
  }

  static loadFromStorage(): UserPreferencesManager {
    const stored = localStorage.getItem('userPreferences');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return new UserPreferencesManager(parsed);
      } catch {
        return new UserPreferencesManager();
      }
    }
    return new UserPreferencesManager();
  }
}

export { UserPreferencesManager, type UserPreferences };