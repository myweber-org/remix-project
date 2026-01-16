interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  fontSize: 14
};

class PreferenceManager {
  private readonly STORAGE_KEY = 'user_preferences';

  validatePreferences(prefs: Partial<UserPreferences>): boolean {
    if (prefs.theme && !['light', 'dark', 'auto'].includes(prefs.theme)) {
      return false;
    }
    if (prefs.fontSize && (prefs.fontSize < 8 || prefs.fontSize > 32)) {
      return false;
    }
    if (prefs.language && typeof prefs.language !== 'string') {
      return false;
    }
    return true;
  }

  loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return DEFAULT_PREFERENCES;

      const parsed = JSON.parse(stored) as Partial<UserPreferences>;
      if (!this.validatePreferences(parsed)) {
        return DEFAULT_PREFERENCES;
      }

      return { ...DEFAULT_PREFERENCES, ...parsed };
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }

  savePreferences(prefs: Partial<UserPreferences>): boolean {
    if (!this.validatePreferences(prefs)) {
      return false;
    }

    const current = this.loadPreferences();
    const updated = { ...current, ...prefs };

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch {
      return false;
    }
  }

  resetToDefaults(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export { PreferenceManager, type UserPreferences };