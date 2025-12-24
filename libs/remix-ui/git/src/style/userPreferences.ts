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

class PreferenceManager {
  private storageKey: string = 'user_preferences';
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
      console.warn('Failed to load preferences from storage:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private validatePreferences(prefs: any): UserPreferences {
    const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

    if (prefs.theme && ['light', 'dark', 'auto'].includes(prefs.theme)) {
      validated.theme = prefs.theme;
    }

    if (typeof prefs.language === 'string' && prefs.language.length > 0) {
      validated.language = prefs.language;
    }

    if (typeof prefs.notifications === 'boolean') {
      validated.notifications = prefs.notifications;
    }

    if (typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 32) {
      validated.fontSize = prefs.fontSize;
    }

    return validated;
  }

  getPreferences(): UserPreferences {
    return { ...this.currentPreferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = { ...this.currentPreferences, ...updates };
    const validated = this.validatePreferences(newPreferences);

    if (JSON.stringify(validated) !== JSON.stringify(this.currentPreferences)) {
      this.currentPreferences = validated;
      this.savePreferences();
      return true;
    }
    return false;
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.currentPreferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  resetToDefaults(): void {
    this.currentPreferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }
}

export const preferenceManager = new PreferenceManager();