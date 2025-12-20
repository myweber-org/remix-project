interface UserPreferences {
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
  private static readonly STORAGE_KEY = 'user_preferences_v1';

  static loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return { ...DEFAULT_PREFERENCES };

      const parsed = JSON.parse(stored);
      return {
        ...DEFAULT_PREFERENCES,
        ...parsed,
        fontSize: Math.max(12, Math.min(parsed.fontSize || DEFAULT_PREFERENCES.fontSize, 24))
      };
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  }

  static savePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    const current = this.loadPreferences();
    const updated = { ...current, ...prefs };
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }

  static resetToDefaults(): UserPreferences {
    localStorage.removeItem(this.STORAGE_KEY);
    return { ...DEFAULT_PREFERENCES };
  }

  static getTheme(): UserPreferences['theme'] {
    return this.loadPreferences().theme;
  }

  static setTheme(theme: UserPreferences['theme']): UserPreferences {
    return this.savePreferences({ theme });
  }
}

export { UserPreferencesManager, type UserPreferences };