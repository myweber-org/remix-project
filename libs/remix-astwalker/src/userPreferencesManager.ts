typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notificationsEnabled: boolean;
    itemsPerPage: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    language: 'en-US',
    notificationsEnabled: true,
    itemsPerPage: 25
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

    private savePreferences(): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
        } catch (error) {
            console.warn('Failed to save user preferences:', error);
        }
    }

    getPreference<K extends keyof UserPreferences>(key: K): UserPreferences[K] {
        return this.preferences[key];
    }

    setPreference<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]): void {
        this.preferences[key] = value;
        this.savePreferences();
    }

    updatePreferences(updates: Partial<UserPreferences>): void {
        this.preferences = { ...this.preferences, ...updates };
        this.savePreferences();
    }

    resetToDefaults(): void {
        this.preferences = { ...DEFAULT_PREFERENCES };
        this.savePreferences();
    }

    getAllPreferences(): Readonly<UserPreferences> {
        return { ...this.preferences };
    }
}

export const userPreferences = new UserPreferencesManager();
```import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notificationsEnabled: z.boolean().default(true),
  language: z.string().min(2).default('en'),
  fontSize: z.number().min(8).max(32).default(14),
  autoSave: z.boolean().default(true),
  lastUpdated: z.date().optional()
});

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

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
        const result = UserPreferencesSchema.safeParse({
          ...parsed,
          lastUpdated: parsed.lastUpdated ? new Date(parsed.lastUpdated) : undefined
        });
        return result.success ? result.data : UserPreferencesSchema.parse({});
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
    }
    return UserPreferencesSchema.parse({});
  }

  private savePreferences(): void {
    try {
      const dataToStore = {
        ...this.preferences,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const validated = UserPreferencesSchema.partial().safeParse(updates);
    if (!validated.success) {
      throw new Error(`Invalid preferences update: ${validated.error.message}`);
    }

    this.preferences = {
      ...this.preferences,
      ...validated.data
    };
    this.savePreferences();
  }

  resetToDefaults(): void {
    this.preferences = UserPreferencesSchema.parse({});
    this.savePreferences();
  }

  clearPreferences(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.preferences = UserPreferencesSchema.parse({});
  }

  getLastUpdateDate(): Date | undefined {
    return this.preferences.lastUpdated;
  }

  isDarkMode(): boolean {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.preferences.theme === 'dark';
  }
}

export const userPreferences = new UserPreferencesManager();