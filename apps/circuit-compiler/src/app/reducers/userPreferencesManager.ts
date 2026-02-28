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
    
    try {
      localStorage.setItem(
        UserPreferencesManager.STORAGE_KEY, 
        JSON.stringify(this.preferences)
      );
    } catch (error) {
      console.error('Failed to save preferences:', error);
      this.preferences = oldPreferences;
      throw new Error('Preferences save failed');
    }
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = this.getDefaultPreferences();
    localStorage.removeItem(UserPreferencesManager.STORAGE_KEY);
  }

  validatePreferences(prefs: Partial<UserPreferences>): string[] {
    const errors: string[] = [];

    if (prefs.theme !== undefined && !['light', 'dark', 'auto'].includes(prefs.theme)) {
      errors.push('Invalid theme value');
    }

    if (prefs.fontSize !== undefined && (prefs.fontSize < 8 || prefs.fontSize > 32)) {
      errors.push('Font size must be between 8 and 32');
    }

    if (prefs.language !== undefined && !/^[a-z]{2}(-[A-Z]{2})?$/.test(prefs.language)) {
      errors.push('Invalid language code format');
    }

    return errors;
  }

  isDarkMode(): boolean {
    if (this.preferences.theme === 'dark') return true;
    if (this.preferences.theme === 'light') return false;
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}

export { UserPreferencesManager, type UserPreferences };