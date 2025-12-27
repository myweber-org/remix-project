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

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validateAndMerge(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private validateAndMerge(partial: Partial<UserPreferences>): UserPreferences {
    const merged = { ...DEFAULT_PREFERENCES, ...partial };
    
    if (!['light', 'dark', 'auto'].includes(merged.theme)) {
      merged.theme = DEFAULT_PREFERENCES.theme;
    }
    
    if (typeof merged.language !== 'string' || merged.language.trim() === '') {
      merged.language = DEFAULT_PREFERENCES.language;
    }
    
    if (typeof merged.notifications !== 'boolean') {
      merged.notifications = DEFAULT_PREFERENCES.notifications;
    }
    
    if (typeof merged.fontSize !== 'number' || merged.fontSize < 8 || merged.fontSize > 72) {
      merged.fontSize = DEFAULT_PREFERENCES.fontSize;
    }
    
    if (typeof merged.autoSave !== 'boolean') {
      merged.autoSave = DEFAULT_PREFERENCES.autoSave;
    }
    
    return merged;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    try {
      const newPreferences = this.validateAndMerge({ ...this.preferences, ...updates });
      this.preferences = newPreferences;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
      return true;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      return false;
    }
  }

  resetToDefaults(): boolean {
    return this.updatePreferences(DEFAULT_PREFERENCES);
  }

  getPreference<K extends keyof UserPreferences>(key: K): UserPreferences[K] {
    return this.preferences[key];
  }
}

export const preferencesManager = new UserPreferencesManager();
```interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private static readonly DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 14
  };

  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  public getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  public updatePreferences(updates: Partial<UserPreferences>): void {
    const validatedUpdates = this.validateUpdates(updates);
    this.preferences = { ...this.preferences, ...validatedUpdates };
    this.savePreferences();
  }

  public resetToDefaults(): void {
    this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validatePreferences(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage', error);
    }
    return { ...UserPreferencesManager.DEFAULT_PREFERENCES };
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(
        UserPreferencesManager.STORAGE_KEY,
        JSON.stringify(this.preferences)
      );
    } catch (error) {
      console.error('Failed to save preferences to storage', error);
    }
  }

  private validatePreferences(data: unknown): UserPreferences {
    const defaultPrefs = UserPreferencesManager.DEFAULT_PREFERENCES;
    
    if (!data || typeof data !== 'object') {
      return { ...defaultPrefs };
    }

    const validated: UserPreferences = { ...defaultPrefs };

    if ('theme' in data && 
        typeof data.theme === 'string' && 
        ['light', 'dark', 'auto'].includes(data.theme)) {
      validated.theme = data.theme as UserPreferences['theme'];
    }

    if ('notifications' in data && typeof data.notifications === 'boolean') {
      validated.notifications = data.notifications;
    }

    if ('language' in data && typeof data.language === 'string') {
      validated.language = data.language;
    }

    if ('fontSize' in data && typeof data.fontSize === 'number') {
      validated.fontSize = Math.max(8, Math.min(32, data.fontSize));
    }

    return validated;
  }

  private validateUpdates(updates: Partial<UserPreferences>): Partial<UserPreferences> {
    const validated: Partial<UserPreferences> = {};

    if (updates.theme !== undefined && 
        ['light', 'dark', 'auto'].includes(updates.theme)) {
      validated.theme = updates.theme;
    }

    if (updates.notifications !== undefined && 
        typeof updates.notifications === 'boolean') {
      validated.notifications = updates.notifications;
    }

    if (updates.language !== undefined && 
        typeof updates.language === 'string' && 
        updates.language.length >= 2) {
      validated.language = updates.language;
    }

    if (updates.fontSize !== undefined && 
        typeof updates.fontSize === 'number') {
      validated.fontSize = Math.max(8, Math.min(32, updates.fontSize));
    }

    return validated;
  }
}

export { UserPreferencesManager, type UserPreferences };