interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  fontSize: 14
};

class PreferencesManager {
  private readonly STORAGE_KEY = 'user_preferences';
  
  constructor() {
    this.ensureDefaults();
  }

  private ensureDefaults(): void {
    if (!this.getPreferences()) {
      this.savePreferences(DEFAULT_PREFERENCES);
    }
  }

  getPreferences(): UserPreferences | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  savePreferences(prefs: Partial<UserPreferences>): boolean {
    try {
      const current = this.getPreferences() || DEFAULT_PREFERENCES;
      const merged = { ...current, ...prefs };
      
      if (!this.validatePreferences(merged)) {
        return false;
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(merged));
      return true;
    } catch {
      return false;
    }
  }

  private validatePreferences(prefs: UserPreferences): boolean {
    const validThemes = ['light', 'dark', 'auto'];
    const minFontSize = 8;
    const maxFontSize = 32;

    return (
      validThemes.includes(prefs.theme) &&
      typeof prefs.notifications === 'boolean' &&
      typeof prefs.language === 'string' &&
      prefs.language.length >= 2 &&
      prefs.fontSize >= minFontSize &&
      prefs.fontSize <= maxFontSize
    );
  }

  resetToDefaults(): void {
    this.savePreferences(DEFAULT_PREFERENCES);
  }

  getCurrentTheme(): string {
    const prefs = this.getPreferences();
    if (!prefs) return DEFAULT_PREFERENCES.theme;

    if (prefs.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return prefs.theme;
  }
}

export { PreferencesManager, DEFAULT_PREFERENCES };
export type { UserPreferences };