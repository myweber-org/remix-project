interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
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
      language: 'en',
      notificationsEnabled: true,
      fontSize: 16
    };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const oldPreferences = { ...this.preferences };
    this.preferences = { ...this.preferences, ...updates };
    
    if (!this.validatePreferences(this.preferences)) {
      this.preferences = oldPreferences;
      throw new Error('Invalid preferences provided');
    }

    this.savePreferences();
  }

  private validatePreferences(prefs: UserPreferences): boolean {
    const validThemes = ['light', 'dark', 'auto'];
    if (!validThemes.includes(prefs.theme)) {
      return false;
    }

    if (typeof prefs.language !== 'string' || prefs.language.length === 0) {
      return false;
    }

    if (typeof prefs.notificationsEnabled !== 'boolean') {
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
      throw new Error('Unable to persist preferences');
    }
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = this.getDefaultPreferences();
    this.savePreferences();
  }

  hasUnsavedChanges(): boolean {
    const saved = this.loadPreferences();
    return JSON.stringify(saved) !== JSON.stringify(this.preferences);
  }
}

export { UserPreferencesManager, type UserPreferences };typescript
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

class UserPreferencesManager {
    private preferences: UserPreferences;
    private readonly storageKey = 'user_preferences';

    constructor() {
        this.preferences = this.loadPreferences();
    }

    private loadPreferences(): UserPreferences {
        try {
            const stored = localStorage.getItem(this.storageKey);
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
        const prefs = { ...DEFAULT_PREFERENCES };
        
        if (data && typeof data === 'object') {
            const obj = data as Record<string, unknown>;
            
            if (obj.theme && ['light', 'dark', 'auto'].includes(obj.theme as string)) {
                prefs.theme = obj.theme as UserPreferences['theme'];
            }
            
            if (typeof obj.notifications === 'boolean') {
                prefs.notifications = obj.notifications;
            }
            
            if (typeof obj.language === 'string' && obj.language.length >= 2) {
                prefs.language = obj.language;
            }
            
            if (typeof obj.fontSize === 'number' && obj.fontSize >= 8 && obj.fontSize <= 24) {
                prefs.fontSize = obj.fontSize;
            }
        }
        
        return prefs;
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
            localStorage.setItem(this.storageKey, JSON.stringify(this.preferences));
        } catch (error) {
            console.error('Failed to save preferences:', error);
        }
    }

    resetToDefaults(): void {
        this.preferences = { ...DEFAULT_PREFERENCES };
        this.savePreferences();
    }

    hasValidPreferences(): boolean {
        return JSON.stringify(this.preferences) !== JSON.stringify(DEFAULT_PREFERENCES);
    }
}

export { UserPreferencesManager, type UserPreferences };
```