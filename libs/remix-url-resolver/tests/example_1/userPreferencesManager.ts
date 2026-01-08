interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor(defaultPreferences: UserPreferences) {
    this.preferences = this.loadPreferences() || defaultPreferences;
  }

  private loadPreferences(): UserPreferences | null {
    const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
    if (!stored) return null;

    try {
      const parsed = JSON.parse(stored);
      if (this.validatePreferences(parsed)) {
        return parsed;
      }
    } catch (error) {
      console.warn('Failed to parse stored preferences:', error);
    }
    return null;
  }

  private validatePreferences(data: unknown): data is UserPreferences {
    if (!data || typeof data !== 'object') return false;

    const prefs = data as Record<string, unknown>;
    
    const validThemes = ['light', 'dark', 'auto'];
    if (!validThemes.includes(prefs.theme as string)) return false;
    
    if (typeof prefs.notifications !== 'boolean') return false;
    
    if (typeof prefs.language !== 'string' || prefs.language.length === 0) return false;
    
    if (typeof prefs.fontSize !== 'number' || prefs.fontSize < 8 || prefs.fontSize > 72) return false;

    return true;
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = { ...this.preferences, ...updates };
    
    if (!this.validatePreferences(newPreferences)) {
      return false;
    }

    this.preferences = newPreferences;
    this.savePreferences();
    return true;
  }

  private savePreferences(): void {
    localStorage.setItem(
      UserPreferencesManager.STORAGE_KEY,
      JSON.stringify(this.preferences)
    );
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefault(defaultPreferences: UserPreferences): void {
    this.preferences = defaultPreferences;
    this.savePreferences();
  }
}

const defaultUserPreferences: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  fontSize: 16
};

export { UserPreferencesManager, defaultUserPreferences, type UserPreferences };