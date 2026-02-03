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

class PreferenceManager {
  private storageKey = 'user_preferences';
  private currentPreferences: UserPreferences;

  constructor() {
    this.currentPreferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validatePreferences(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences, using defaults:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private validatePreferences(prefs: any): UserPreferences {
    return {
      theme: ['light', 'dark', 'auto'].includes(prefs.theme) ? prefs.theme : DEFAULT_PREFERENCES.theme,
      notifications: typeof prefs.notifications === 'boolean' ? prefs.notifications : DEFAULT_PREFERENCES.notifications,
      language: typeof prefs.language === 'string' ? prefs.language : DEFAULT_PREFERENCES.language,
      fontSize: typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 24 
        ? prefs.fontSize 
        : DEFAULT_PREFERENCES.fontSize
    };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.currentPreferences = {
      ...this.currentPreferences,
      ...this.validatePreferences(updates)
    };
    this.savePreferences();
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.currentPreferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  getPreferences(): UserPreferences {
    return { ...this.currentPreferences };
  }

  resetToDefaults(): void {
    this.currentPreferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }
}

export const preferenceManager = new PreferenceManager();