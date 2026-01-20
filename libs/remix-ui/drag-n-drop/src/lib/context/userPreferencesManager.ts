interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private defaultPreferences: UserPreferences = {
    theme: 'auto',
    language: 'en-US',
    notificationsEnabled: true,
    fontSize: 16
  };

  private validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = {
      theme: ['light', 'dark', 'auto'].includes(prefs.theme || '') 
        ? prefs.theme as UserPreferences['theme'] 
        : this.defaultPreferences.theme,
      language: typeof prefs.language === 'string' && prefs.language.length >= 2
        ? prefs.language
        : this.defaultPreferences.language,
      notificationsEnabled: typeof prefs.notificationsEnabled === 'boolean'
        ? prefs.notificationsEnabled
        : this.defaultPreferences.notificationsEnabled,
      fontSize: typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 32
        ? prefs.fontSize
        : this.defaultPreferences.fontSize
    };
    return validated;
  }

  savePreferences(preferences: Partial<UserPreferences>): void {
    const validatedPrefs = this.validatePreferences(preferences);
    try {
      localStorage.setItem(
        UserPreferencesManager.STORAGE_KEY,
        JSON.stringify(validatedPrefs)
      );
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validatePreferences(parsed);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
    return { ...this.defaultPreferences };
  }

  resetToDefaults(): void {
    this.savePreferences(this.defaultPreferences);
  }

  getCurrentTheme(): UserPreferences['theme'] {
    const prefs = this.loadPreferences();
    if (prefs.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return prefs.theme;
  }
}

export { UserPreferencesManager, type UserPreferences };