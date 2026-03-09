
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  fontSize: number;
  notificationsEnabled: boolean;
  language: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  fontSize: 16,
  notificationsEnabled: true,
  language: 'en-US'
};

class UserPreferencesManager {
  private readonly storageKey = 'app_user_preferences';

  loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validateAndMerge(parsed);
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  savePreferences(preferences: Partial<UserPreferences>): void {
    try {
      const current = this.loadPreferences();
      const merged = { ...current, ...preferences };
      const validated = this.validateAndMerge(merged);
      localStorage.setItem(this.storageKey, JSON.stringify(validated));
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

  private validateAndMerge(data: unknown): UserPreferences {
    const result = { ...DEFAULT_PREFERENCES };

    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;

      if (obj.theme && ['light', 'dark', 'auto'].includes(obj.theme as string)) {
        result.theme = obj.theme as UserPreferences['theme'];
      }

      if (typeof obj.fontSize === 'number' && obj.fontSize >= 12 && obj.fontSize <= 24) {
        result.fontSize = obj.fontSize;
      }

      if (typeof obj.notificationsEnabled === 'boolean') {
        result.notificationsEnabled = obj.notificationsEnabled;
      }

      if (typeof obj.language === 'string' && obj.language.length >= 2) {
        result.language = obj.language;
      }
    }

    return result;
  }
}

export const userPreferencesManager = new UserPreferencesManager();