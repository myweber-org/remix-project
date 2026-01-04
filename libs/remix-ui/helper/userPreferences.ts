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
  private static STORAGE_KEY = 'user_preferences';

  static loadPreferences(): UserPreferences {
    const stored = localStorage.getItem(this.STORAGE_KEY);
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

  static savePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    const current = this.loadPreferences();
    const updated = { ...current, ...prefs };
    const validated = this.validatePreferences(updated);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(validated));
    return validated;
  }

  private static validatePreferences(prefs: any): UserPreferences {
    const validThemes: UserPreferences['theme'][] = ['light', 'dark', 'auto'];
    
    return {
      theme: validThemes.includes(prefs.theme) ? prefs.theme : DEFAULT_PREFERENCES.theme,
      notifications: typeof prefs.notifications === 'boolean' ? prefs.notifications : DEFAULT_PREFERENCES.notifications,
      language: typeof prefs.language === 'string' && prefs.language.length >= 2 ? prefs.language : DEFAULT_PREFERENCES.language,
      fontSize: typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 24 ? prefs.fontSize : DEFAULT_PREFERENCES.fontSize
    };
  }

  static resetToDefaults(): UserPreferences {
    localStorage.removeItem(this.STORAGE_KEY);
    return { ...DEFAULT_PREFERENCES };
  }
}

export { UserPreferences, PreferenceManager };