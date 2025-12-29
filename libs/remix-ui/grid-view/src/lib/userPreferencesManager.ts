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
    this.preferences = this.loadPreferences() || this.getDefaultPreferences();
    
    if (defaultPreferences) {
      this.preferences = { ...this.preferences, ...defaultPreferences };
    }
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      language: 'en',
      notificationsEnabled: true,
      fontSize: 16
    };
  }

  private loadPreferences(): UserPreferences | null {
    try {
      const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  savePreferences(): boolean {
    try {
      localStorage.setItem(
        UserPreferencesManager.STORAGE_KEY, 
        JSON.stringify(this.preferences)
      );
      return true;
    } catch {
      return false;
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  validatePreferences(): boolean {
    const validThemes = ['light', 'dark', 'auto'];
    const minFontSize = 8;
    const maxFontSize = 32;

    return (
      validThemes.includes(this.preferences.theme) &&
      typeof this.preferences.language === 'string' &&
      this.preferences.language.length >= 2 &&
      typeof this.preferences.notificationsEnabled === 'boolean' &&
      this.preferences.fontSize >= minFontSize &&
      this.preferences.fontSize <= maxFontSize
    );
  }

  resetToDefaults(): void {
    this.preferences = this.getDefaultPreferences();
  }
}

export { UserPreferencesManager, type UserPreferences };