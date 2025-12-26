interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private static readonly DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 16
  };

  static validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = { ...this.DEFAULT_PREFERENCES, ...prefs };
    
    if (!['light', 'dark', 'auto'].includes(validated.theme)) {
      validated.theme = 'auto';
    }
    
    if (typeof validated.notifications !== 'boolean') {
      validated.notifications = true;
    }
    
    if (typeof validated.language !== 'string' || validated.language.length !== 2) {
      validated.language = 'en';
    }
    
    if (typeof validated.fontSize !== 'number' || validated.fontSize < 8 || validated.fontSize > 32) {
      validated.fontSize = 16;
    }
    
    return validated;
  }

  static savePreferences(prefs: Partial<UserPreferences>): boolean {
    try {
      const validated = this.validatePreferences(prefs);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(validated));
      return true;
    } catch {
      return false;
    }
  }

  static loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return this.validatePreferences(JSON.parse(stored));
      }
    } catch {
      // Fall through to default
    }
    return { ...this.DEFAULT_PREFERENCES };
  }

  static resetToDefaults(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export { UserPreferences, PreferencesManager };