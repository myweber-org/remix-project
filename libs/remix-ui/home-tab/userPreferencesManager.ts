interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  language: 'en',
  notificationsEnabled: true,
  fontSize: 14
};

class UserPreferencesManager {
  private readonly storageKey = 'user_preferences';

  getPreferences(): UserPreferences {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
      } catch {
        return DEFAULT_PREFERENCES;
      }
    }
    return DEFAULT_PREFERENCES;
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const updated = { ...current, ...updates };
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
    return updated;
  }

  resetToDefaults(): UserPreferences {
    localStorage.removeItem(this.storageKey);
    return DEFAULT_PREFERENCES;
  }

  hasSavedPreferences(): boolean {
    return localStorage.getItem(this.storageKey) !== null;
  }
}

export const preferencesManager = new UserPreferencesManager();