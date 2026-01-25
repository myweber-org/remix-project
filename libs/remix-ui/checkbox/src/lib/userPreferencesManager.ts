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
  private static readonly STORAGE_KEY = 'user_preferences';

  static getPreferences(): UserPreferences {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return { ...DEFAULT_PREFERENCES };

    try {
      const parsed = JSON.parse(stored) as Partial<UserPreferences>;
      return { ...DEFAULT_PREFERENCES, ...parsed };
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  }

  static updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const updated = { ...current, ...updates };
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }

  static resetToDefaults(): UserPreferences {
    localStorage.removeItem(this.STORAGE_KEY);
    return { ...DEFAULT_PREFERENCES };
  }

  static validatePreferences(prefs: unknown): prefs is UserPreferences {
    if (typeof prefs !== 'object' || prefs === null) return false;
    
    const required = prefs as Record<string, unknown>;
    return (
      ['light', 'dark'].includes(required.theme as string) &&
      typeof required.language === 'string' &&
      typeof required.notificationsEnabled === 'boolean' &&
      typeof required.fontSize === 'number' &&
      required.fontSize >= 8 &&
      required.fontSize <= 32
    );
  }
}

export { UserPreferencesManager, type UserPreferences };