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

class PreferenceManager {
  private preferences: UserPreferences;

  constructor(initialPreferences?: Partial<UserPreferences>) {
    this.preferences = { ...DEFAULT_PREFERENCES, ...initialPreferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    if (!this.validatePreferences(updates)) {
      return false;
    }

    this.preferences = { ...this.preferences, ...updates };
    this.saveToStorage();
    return true;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  resetToDefault(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.saveToStorage();
  }

  private validatePreferences(prefs: Partial<UserPreferences>): boolean {
    if (prefs.theme && !['light', 'dark', 'auto'].includes(prefs.theme)) {
      return false;
    }

    if (prefs.language && typeof prefs.language !== 'string') {
      return false;
    }

    if (prefs.timezone && typeof prefs.timezone !== 'string') {
      return false;
    }

    return true;
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  static loadFromStorage(): PreferenceManager {
    try {
      const stored = localStorage.getItem('userPreferences');
      if (stored) {
        const parsed = JSON.parse(stored);
        return new PreferenceManager(parsed);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
    return new PreferenceManager();
  }
}

export { PreferenceManager, type UserPreferences };