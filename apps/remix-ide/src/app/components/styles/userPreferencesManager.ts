typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  fontSize: number;
  autoSave: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en-US',
  notifications: true,
  fontSize: 14,
  autoSave: true
};

const STORAGE_KEY = 'user_preferences';

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const validated = this.validateUpdates(updates);
    this.preferences = { ...this.preferences, ...validated };
    this.savePreferences();
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validatePreferences(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences to storage', error);
    }
  }

  private validatePreferences(data: unknown): UserPreferences {
    if (!data || typeof data !== 'object') {
      return { ...DEFAULT_PREFERENCES };
    }

    const result = { ...DEFAULT_PREFERENCES };

    if ('theme' in data && ['light', 'dark', 'auto'].includes(data.theme as string)) {
      result.theme = data.theme as UserPreferences['theme'];
    }

    if ('language' in data && typeof data.language === 'string') {
      result.language = data.language;
    }

    if ('notifications' in data && typeof data.notifications === 'boolean') {
      result.notifications = data.notifications;
    }

    if ('fontSize' in data && typeof data.fontSize === 'number' && data.fontSize >= 8 && data.fontSize <= 32) {
      result.fontSize = data.fontSize;
    }

    if ('autoSave' in data && typeof data.autoSave === 'boolean') {
      result.autoSave = data.autoSave;
    }

    return result;
  }

  private validateUpdates(updates: Partial<UserPreferences>): Partial<UserPreferences> {
    const result: Partial<UserPreferences> = {};

    if (updates.theme && ['light', 'dark', 'auto'].includes(updates.theme)) {
      result.theme = updates.theme;
    }

    if (updates.language && typeof updates.language === 'string') {
      result.language = updates.language;
    }

    if (typeof updates.notifications === 'boolean') {
      result.notifications = updates.notifications;
    }

    if (typeof updates.fontSize === 'number' && updates.fontSize >= 8 && updates.fontSize <= 32) {
      result.fontSize = updates.fontSize;
    }

    if (typeof updates.autoSave === 'boolean') {
      result.autoSave = updates.autoSave;
    }

    return result;
  }
}

export const preferencesManager = new UserPreferencesManager();
```