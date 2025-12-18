interface UserPreferences {
  theme: 'light' | 'dark';
  fontSize: number;
  notificationsEnabled: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  fontSize: 14,
  notificationsEnabled: true
};

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';

  static loadPreferences(): UserPreferences {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return { ...DEFAULT_PREFERENCES };

    try {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_PREFERENCES, ...parsed };
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  }

  static savePreferences(prefs: Partial<UserPreferences>): void {
    const current = this.loadPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
  }

  static resetToDefaults(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static getPreference<K extends keyof UserPreferences>(key: K): UserPreferences[K] {
    const prefs = this.loadPreferences();
    return prefs[key];
  }
}

export { UserPreferencesManager, type UserPreferences };