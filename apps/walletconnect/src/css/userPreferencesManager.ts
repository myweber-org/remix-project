typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notificationsEnabled: boolean;
    fontSize: number;
}

type PreferenceChangeCallback = (key: keyof UserPreferences, value: any) => void;

class UserPreferencesManager {
    private static readonly STORAGE_KEY = 'user_preferences';
    private preferences: UserPreferences;
    private changeListeners: PreferenceChangeCallback[] = [];

    constructor(defaultPreferences: UserPreferences) {
        const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
        this.preferences = stored ? JSON.parse(stored) : defaultPreferences;
    }

    get<K extends keyof UserPreferences>(key: K): UserPreferences[K] {
        return this.preferences[key];
    }

    set<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]): void {
        const oldValue = this.preferences[key];
        if (oldValue !== value) {
            this.preferences[key] = value;
            this.saveToStorage();
            this.notifyListeners(key, value);
        }
    }

    setMultiple(changes: Partial<UserPreferences>): void {
        let hasChanges = false;
        
        for (const [key, value] of Object.entries(changes)) {
            const prefKey = key as keyof UserPreferences;
            if (this.preferences[prefKey] !== value) {
                this.preferences[prefKey] = value as UserPreferences[keyof UserPreferences];
                hasChanges = true;
                this.notifyListeners(prefKey, value);
            }
        }

        if (hasChanges) {
            this.saveToStorage();
        }
    }

    resetToDefaults(defaults: UserPreferences): void {
        this.preferences = { ...defaults };
        this.saveToStorage();
        
        for (const [key, value] of Object.entries(defaults)) {
            this.notifyListeners(key as keyof UserPreferences, value);
        }
    }

    subscribe(callback: PreferenceChangeCallback): () => void {
        this.changeListeners.push(callback);
        return () => {
            const index = this.changeListeners.indexOf(callback);
            if (index > -1) {
                this.changeListeners.splice(index, 1);
            }
        };
    }

    private saveToStorage(): void {
        localStorage.setItem(
            UserPreferencesManager.STORAGE_KEY,
            JSON.stringify(this.preferences)
        );
    }

    private notifyListeners(key: keyof UserPreferences, value: any): void {
        this.changeListeners.forEach(callback => {
            try {
                callback(key, value);
            } catch (error) {
                console.error('Error in preference change listener:', error);
            }
        });
    }
}

const defaultPreferences: UserPreferences = {
    theme: 'auto',
    language: 'en',
    notificationsEnabled: true,
    fontSize: 14
};

export const userPreferences = new UserPreferencesManager(defaultPreferences);
```interface UserPreferences {
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
      console.warn('Failed to load user preferences:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
    this.savePreferences();
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
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

export const preferencesManager = new UserPreferencesManager();