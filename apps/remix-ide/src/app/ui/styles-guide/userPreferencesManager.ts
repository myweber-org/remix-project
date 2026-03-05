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
const MAX_FONT_SIZE = 32;

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor(initialPreferences?: Partial<UserPreferences>) {
    this.preferences = { ...DEFAULT_PREFERENCES, ...initialPreferences };
    this.validateAndFixPreferences();
  }

  private validateAndFixPreferences(): void {
    if (!['light', 'dark', 'auto'].includes(this.preferences.theme)) {
      this.preferences.theme = DEFAULT_PREFERENCES.theme;
    }

    if (typeof this.preferences.notifications !== 'boolean') {
      this.preferences.notifications = DEFAULT_PREFERENCES.notifications;
    }

    if (!VALID_LANGUAGES.includes(this.preferences.language)) {
      this.preferences.language = DEFAULT_PREFERENCES.language;
    }

    if (typeof this.preferences.fontSize !== 'number' || 
        this.preferences.fontSize < MIN_FONT_SIZE || 
        this.preferences.fontSize > MAX_FONT_SIZE) {
      this.preferences.fontSize = DEFAULT_PREFERENCES.fontSize;
    }
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const oldPreferences = { ...this.preferences };
    this.preferences = { ...this.preferences, ...updates };
    this.validateAndFixPreferences();
    
    return JSON.stringify(oldPreferences) !== JSON.stringify(this.preferences);
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
  }

  exportAsJSON(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  static importFromJSON(jsonString: string): UserPreferencesManager | null {
    try {
      const parsed = JSON.parse(jsonString);
      return new UserPreferencesManager(parsed);
    } catch {
      return null;
    }
  }
}

export { UserPreferencesManager, DEFAULT_PREFERENCES, VALID_LANGUAGES };interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  fontSize: number;
  notificationsEnabled: boolean;
  language: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  fontSize: 16,
  notificationsEnabled: true,
  language: 'en-US'
};

class UserPreferencesManager {
  private readonly storageKey = 'user_preferences';
  
  getPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }
  
  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const updated = { ...current, ...updates };
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
    
    return updated;
  }
  
  resetToDefaults(): UserPreferences {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.warn('Failed to clear preferences:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }
  
  hasStoredPreferences(): boolean {
    return localStorage.getItem(this.storageKey) !== null;
  }
}

export const preferencesManager = new UserPreferencesManager();interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  fontSize: number;
  notificationsEnabled: boolean;
  language: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  fontSize: 16,
  notificationsEnabled: true,
  language: 'en-US'
};

const STORAGE_KEY = 'app_user_preferences';

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
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load preferences from localStorage:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.warn('Failed to save preferences to localStorage:', error);
    }
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
    this.savePreferences();
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

export const userPreferences = new UserPreferencesManager();