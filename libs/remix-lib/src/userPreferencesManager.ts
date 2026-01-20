typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
  autoSave: boolean;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private static readonly DEFAULT_PREFS: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 14,
    autoSave: true
  };

  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validateAndMerge(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage:', error);
    }
    return { ...UserPreferencesManager.DEFAULT_PREFS };
  }

  private validateAndMerge(partialPrefs: Partial<UserPreferences>): UserPreferences {
    const merged = { ...UserPreferencesManager.DEFAULT_PREFS, ...partialPrefs };
    
    if (!['light', 'dark', 'auto'].includes(merged.theme)) {
      merged.theme = UserPreferencesManager.DEFAULT_PREFS.theme;
    }
    
    if (typeof merged.notifications !== 'boolean') {
      merged.notifications = UserPreferencesManager.DEFAULT_PREFS.notifications;
    }
    
    if (typeof merged.language !== 'string' || merged.language.length !== 2) {
      merged.language = UserPreferencesManager.DEFAULT_PREFS.language;
    }
    
    if (typeof merged.fontSize !== 'number' || merged.fontSize < 8 || merged.fontSize > 32) {
      merged.fontSize = UserPreferencesManager.DEFAULT_PREFS.fontSize;
    }
    
    if (typeof merged.autoSave !== 'boolean') {
      merged.autoSave = UserPreferencesManager.DEFAULT_PREFS.autoSave;
    }
    
    return merged;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    try {
      const newPrefs = this.validateAndMerge({ ...this.preferences, ...updates });
      this.preferences = newPrefs;
      localStorage.setItem(UserPreferencesManager.STORAGE_KEY, JSON.stringify(newPrefs));
      return true;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      return false;
    }
  }

  resetToDefaults(): boolean {
    return this.updatePreferences(UserPreferencesManager.DEFAULT_PREFS);
  }

  getPreference<K extends keyof UserPreferences>(key: K): UserPreferences[K] {
    return this.preferences[key];
  }

  setPreference<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]): boolean {
    return this.updatePreferences({ [key]: value });
  }

  exportPreferences(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  importPreferences(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      return this.updatePreferences(parsed);
    } catch (error) {
      console.error('Failed to import preferences:', error);
      return false;
    }
  }
}

export { UserPreferencesManager, type UserPreferences };
```