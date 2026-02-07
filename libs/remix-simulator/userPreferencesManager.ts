typescript
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

const STORAGE_KEY = 'app_user_preferences';

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
                return { ...DEFAULT_PREFERENCES, ...parsed };
            }
        } catch (error) {
            console.warn('Failed to load preferences from storage:', error);
        }
        return { ...DEFAULT_PREFERENCES };
    }

    private savePreferences(): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
        } catch (error) {
            console.error('Failed to save preferences:', error);
        }
    }

    getPreferences(): Readonly<UserPreferences> {
        return { ...this.preferences };
    }

    updatePreferences(updates: Partial<UserPreferences>): void {
        this.preferences = { ...this.preferences, ...updates };
        this.savePreferences();
    }

    resetToDefaults(): void {
        this.preferences = { ...DEFAULT_PREFERENCES };
        this.savePreferences();
    }

    getTheme(): string {
        if (this.preferences.theme === 'auto') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return this.preferences.theme;
    }
}

export const userPreferences = new UserPreferencesManager();
```interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notificationsEnabled: boolean;
  itemsPerPage: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences_v1';
  private defaultPreferences: UserPreferences = {
    theme: 'light',
    language: 'en',
    notificationsEnabled: true,
    itemsPerPage: 20
  };

  getPreferences(): UserPreferences {
    const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
    if (!stored) return { ...this.defaultPreferences };

    try {
      const parsed = JSON.parse(stored);
      return this.validateAndMerge(parsed);
    } catch {
      return { ...this.defaultPreferences };
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const merged = { ...current, ...updates };
    const validated = this.validateAndMerge(merged);
    
    localStorage.setItem(
      UserPreferencesManager.STORAGE_KEY,
      JSON.stringify(validated)
    );
    
    return validated;
  }

  resetToDefaults(): UserPreferences {
    localStorage.removeItem(UserPreferencesManager.STORAGE_KEY);
    return { ...this.defaultPreferences };
  }

  private validateAndMerge(data: unknown): UserPreferences {
    const result = { ...this.defaultPreferences };
    
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      
      if (obj.theme === 'light' || obj.theme === 'dark') {
        result.theme = obj.theme;
      }
      
      if (typeof obj.language === 'string') {
        result.language = obj.language;
      }
      
      if (typeof obj.notificationsEnabled === 'boolean') {
        result.notificationsEnabled = obj.notificationsEnabled;
      }
      
      if (typeof obj.itemsPerPage === 'number' && obj.itemsPerPage > 0) {
        result.itemsPerPage = Math.min(obj.itemsPerPage, 100);
      }
    }
    
    return result;
  }
}

export const userPreferences = new UserPreferencesManager();