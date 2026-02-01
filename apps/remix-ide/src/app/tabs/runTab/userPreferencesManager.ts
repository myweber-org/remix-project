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
      console.warn('Failed to load preferences from storage', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private validatePreferences(data: unknown): UserPreferences {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid preferences data');
    }

    const prefs = data as Record<string, unknown>;
    
    const theme = prefs.theme;
    if (!['light', 'dark', 'auto'].includes(theme as string)) {
      throw new Error('Invalid theme value');
    }

    const language = prefs.language;
    if (typeof language !== 'string' || language.trim().length === 0) {
      throw new Error('Invalid language value');
    }

    const notificationsEnabled = prefs.notificationsEnabled;
    if (typeof notificationsEnabled !== 'boolean') {
      throw new Error('Invalid notificationsEnabled value');
    }

    const fontSize = prefs.fontSize;
    if (typeof fontSize !== 'number' || fontSize < 8 || fontSize > 72) {
      throw new Error('Invalid fontSize value');
    }

    return {
      theme: theme as UserPreferences['theme'],
      language: language as string,
      notificationsEnabled: notificationsEnabled as boolean,
      fontSize: fontSize as number
    };
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
      console.error('Failed to save preferences to storage', error);
    }
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  getTheme(): UserPreferences['theme'] {
    return this.preferences.theme;
  }

  getLanguage(): string {
    return this.preferences.language;
  }

  areNotificationsEnabled(): boolean {
    return this.preferences.notificationsEnabled;
  }

  getFontSize(): number {
    return this.preferences.fontSize;
  }
}

export const userPreferences = new UserPreferencesManager();typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en-US',
  notifications: true,
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
        return this.validateAndMerge(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences, using defaults');
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private validateAndMerge(partial: Partial<UserPreferences>): UserPreferences {
    const merged = { ...DEFAULT_PREFERENCES, ...partial };
    
    if (!['light', 'dark', 'auto'].includes(merged.theme)) {
      merged.theme = DEFAULT_PREFERENCES.theme;
    }
    
    if (!VALID_LANGUAGES.includes(merged.language)) {
      merged.language = DEFAULT_PREFERENCES.language;
    }
    
    if (typeof merged.notifications !== 'boolean') {
      merged.notifications = DEFAULT_PREFERENCES.notifications;
    }
    
    if (typeof merged.fontSize !== 'number' || 
        merged.fontSize < MIN_FONT_SIZE || 
        merged.fontSize > MAX_FONT_SIZE) {
      merged.fontSize = DEFAULT_PREFERENCES.fontSize;
    }
    
    return merged;
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    try {
      const newPreferences = this.validateAndMerge({
        ...this.preferences,
        ...updates
      });
      
      this.preferences = newPreferences;
      localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
      this.dispatchChangeEvent();
      return true;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      return false;
    }
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    localStorage.removeItem('userPreferences');
    this.dispatchChangeEvent();
  }

  private dispatchChangeEvent(): void {
    window.dispatchEvent(new CustomEvent('preferencesChanged', {
      detail: { preferences: this.getPreferences() }
    }));
  }
}

export const preferencesManager = new UserPreferencesManager();
```