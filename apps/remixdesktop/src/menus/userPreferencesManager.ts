interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private static readonly DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    language: 'en-US',
    notificationsEnabled: true,
    fontSize: 14
  };

  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validatePreferences(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences:', error);
    }
    return { ...UserPreferencesManager.DEFAULT_PREFERENCES };
  }

  private validatePreferences(data: any): UserPreferences {
    const validThemes: UserPreferences['theme'][] = ['light', 'dark', 'auto'];
    
    return {
      theme: validThemes.includes(data.theme) ? data.theme : UserPreferencesManager.DEFAULT_PREFERENCES.theme,
      language: typeof data.language === 'string' ? data.language : UserPreferencesManager.DEFAULT_PREFERENCES.language,
      notificationsEnabled: typeof data.notificationsEnabled === 'boolean' 
        ? data.notificationsEnabled 
        : UserPreferencesManager.DEFAULT_PREFERENCES.notificationsEnabled,
      fontSize: typeof data.fontSize === 'number' && data.fontSize >= 8 && data.fontSize <= 32
        ? data.fontSize
        : UserPreferencesManager.DEFAULT_PREFERENCES.fontSize
    };
  }

  savePreferences(): void {
    try {
      localStorage.setItem(
        UserPreferencesManager.STORAGE_KEY,
        JSON.stringify(this.preferences)
      );
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = {
      ...this.preferences,
      ...updates
    };
    this.preferences = this.validatePreferences(this.preferences);
    this.savePreferences();
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  isDarkMode(): boolean {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.preferences.theme === 'dark';
  }
}

export { UserPreferencesManager, type UserPreferences };