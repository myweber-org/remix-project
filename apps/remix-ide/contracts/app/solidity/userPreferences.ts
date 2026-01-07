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

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.validatePreferences(updates);
    this.preferences = { ...this.preferences, ...updates };
    this.saveToStorage();
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  resetToDefault(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.saveToStorage();
  }

  private validatePreferences(prefs: Partial<UserPreferences>): void {
    if (prefs.theme && !['light', 'dark', 'auto'].includes(prefs.theme)) {
      throw new Error('Invalid theme value');
    }

    if (prefs.language && typeof prefs.language !== 'string') {
      throw new Error('Language must be a string');
    }

    if (prefs.timezone && !Intl.DateTimeFormat().resolvedOptions().timeZone) {
      console.warn('Timezone validation skipped in this environment');
    }
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
      const parsed = stored ? JSON.parse(stored) : {};
      return new PreferenceManager(parsed);
    } catch {
      return new PreferenceManager();
    }
  }
}

export { PreferenceManager, type UserPreferences };