interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private static readonly DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 14
  };

  static validatePreferences(prefs: Partial<UserPreferences>): boolean {
    if (prefs.theme && !['light', 'dark', 'auto'].includes(prefs.theme)) {
      return false;
    }
    if (prefs.fontSize && (prefs.fontSize < 8 || prefs.fontSize > 32)) {
      return false;
    }
    return true;
  }

  static loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return { ...this.DEFAULT_PREFERENCES };

      const parsed = JSON.parse(stored);
      return this.validatePreferences(parsed) 
        ? { ...this.DEFAULT_PREFERENCES, ...parsed }
        : { ...this.DEFAULT_PREFERENCES };
    } catch {
      return { ...this.DEFAULT_PREFERENCES };
    }
  }

  static savePreferences(prefs: Partial<UserPreferences>): boolean {
    if (!this.validatePreferences(prefs)) return false;

    const current = this.loadPreferences();
    const updated = { ...current, ...prefs };

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch {
      return false;
    }
  }

  static resetToDefaults(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export { UserPreferences, PreferencesManager };