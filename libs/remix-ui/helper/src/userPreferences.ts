
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  resultsPerPage: number;
  timezone: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  resultsPerPage: 20,
  timezone: 'UTC'
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP'];
const VALID_TIMEZONES = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'];

class PreferencesManager {
  private preferences: UserPreferences;

  constructor(initialPreferences?: Partial<UserPreferences>) {
    this.preferences = { ...DEFAULT_PREFERENCES, ...initialPreferences };
    this.validateAndSanitize();
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = { ...this.preferences, ...updates };
    
    if (this.validatePreferences(newPreferences)) {
      this.preferences = newPreferences;
      this.saveToStorage();
      return true;
    }
    
    return false;
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.saveToStorage();
  }

  private validatePreferences(prefs: UserPreferences): boolean {
    if (!VALID_LANGUAGES.includes(prefs.language)) {
      return false;
    }

    if (!VALID_TIMEZONES.includes(prefs.timezone)) {
      return false;
    }

    if (prefs.resultsPerPage < 5 || prefs.resultsPerPage > 100) {
      return false;
    }

    return true;
  }

  private validateAndSanitize(): void {
    if (!this.validatePreferences(this.preferences)) {
      this.preferences = { ...DEFAULT_PREFERENCES };
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  static loadFromStorage(): PreferencesManager {
    try {
      const stored = localStorage.getItem('userPreferences');
      if (stored) {
        const parsed = JSON.parse(stored);
        return new PreferencesManager(parsed);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
    
    return new PreferencesManager();
  }
}

export { PreferencesManager, type UserPreferences };