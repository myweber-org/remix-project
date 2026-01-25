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
  private readonly storageKey = 'user_preferences';

  loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<UserPreferences>;
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  savePreferences(prefs: Partial<UserPreferences>): void {
    try {
      const current = this.loadPreferences();
      const updated = { ...current, ...prefs };
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }

  resetToDefaults(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Failed to reset preferences:', error);
    }
  }

  getCurrentTheme(): 'light' | 'dark' {
    return this.loadPreferences().theme;
  }
}

export const preferencesManager = new UserPreferencesManager();