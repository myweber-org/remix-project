interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  timezone: 'UTC'
};

class PreferencesManager {
  private preferences: UserPreferences;

  constructor(initialPreferences?: Partial<UserPreferences>) {
    this.preferences = { ...DEFAULT_PREFERENCES, ...initialPreferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    if (updates.theme && !['light', 'dark', 'auto'].includes(updates.theme)) {
      throw new Error('Invalid theme value');
    }

    if (updates.language && !this.isValidLanguage(updates.language)) {
      throw new Error('Invalid language code');
    }

    this.preferences = { ...this.preferences, ...updates };
    this.saveToStorage();
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.saveToStorage();
  }

  private isValidLanguage(lang: string): boolean {
    const languageRegex = /^[a-z]{2}-[A-Z]{2}$/;
    return languageRegex.test(lang);
  }

  private saveToStorage(): void {
    localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
  }

  static loadFromStorage(): PreferencesManager {
    const stored = localStorage.getItem('userPreferences');
    const parsed = stored ? JSON.parse(stored) : {};
    return new PreferencesManager(parsed);
  }
}

export { PreferencesManager, type UserPreferences };