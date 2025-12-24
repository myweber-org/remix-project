typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
  autoSave: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  fontSize: 14,
  autoSave: true
};

class UserPreferencesManager {
  private preferences: UserPreferences;
  private readonly storageKey = 'user_preferences';

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validatePreferences(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private validatePreferences(data: unknown): UserPreferences {
    const result = { ...DEFAULT_PREFERENCES };
    
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      
      if (obj.theme === 'light' || obj.theme === 'dark' || obj.theme === 'auto') {
        result.theme = obj.theme;
      }
      
      if (typeof obj.notifications === 'boolean') {
        result.notifications = obj.notifications;
      }
      
      if (typeof obj.language === 'string' && obj.language.length === 2) {
        result.language = obj.language;
      }
      
      if (typeof obj.fontSize === 'number' && obj.fontSize >= 8 && obj.fontSize <= 24) {
        result.fontSize = obj.fontSize;
      }
      
      if (typeof obj.autoSave === 'boolean') {
        result.autoSave = obj.autoSave;
      }
    }
    
    return result;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = { ...this.preferences, ...updates };
    const validated = this.validatePreferences(newPreferences);
    
    if (JSON.stringify(validated) !== JSON.stringify(this.preferences)) {
      this.preferences = validated;
      this.savePreferences();
      return true;
    }
    return false;
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  isDarkMode(): boolean {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.preferences.theme === 'dark';
  }
}

export const preferencesManager = new UserPreferencesManager();
```