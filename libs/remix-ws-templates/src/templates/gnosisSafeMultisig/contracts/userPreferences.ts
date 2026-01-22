interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  resultsPerPage: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  resultsPerPage: 20
};

class PreferenceManager {
  private preferences: UserPreferences;

  constructor(initialPreferences?: Partial<UserPreferences>) {
    this.preferences = { ...DEFAULT_PREFERENCES, ...initialPreferences };
    this.validatePreferences();
  }

  private validatePreferences(): void {
    if (!['light', 'dark', 'auto'].includes(this.preferences.theme)) {
      throw new Error('Invalid theme preference');
    }
    if (this.preferences.resultsPerPage < 5 || this.preferences.resultsPerPage > 100) {
      throw new Error('Results per page must be between 5 and 100');
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const newPreferences = { ...this.preferences, ...updates };
    const tempManager = new PreferenceManager(newPreferences);
    this.preferences = tempManager.getPreferences();
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
  }

  toStorageString(): string {
    return JSON.stringify(this.preferences);
  }

  static fromStorageString(storageString: string): PreferenceManager {
    try {
      const parsed = JSON.parse(storageString);
      return new PreferenceManager(parsed);
    } catch {
      return new PreferenceManager();
    }
  }
}

export { PreferenceManager, type UserPreferences };