import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notificationsEnabled: z.boolean().default(true),
  language: z.string().min(2).default('en'),
  resultsPerPage: z.number().min(5).max(100).default(20),
  autoSaveInterval: z.number().min(0).max(300).default(60)
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
        return UserPreferencesSchema.parse(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences, using defaults:', error);
    }
    return UserPreferencesSchema.parse({});
  }

  private savePreferences(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const validated = UserPreferencesSchema.partial().parse(updates);
    this.preferences = { ...this.preferences, ...validated };
    this.savePreferences();
  }

  resetToDefaults(): void {
    this.preferences = UserPreferencesSchema.parse({});
    this.savePreferences();
  }

  validatePreferences(prefs: unknown): UserPreferences {
    return UserPreferencesSchema.parse(prefs);
  }
}

export const userPreferencesManager = new UserPreferencesManager();typescript
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
        language: 'en-US',
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
                return this.validatePreferences(parsed);
            }
        } catch (error) {
            console.warn('Failed to load preferences from storage:', error);
        }
        return { ...UserPreferencesManager.DEFAULT_PREFS };
    }

    private validatePreferences(data: any): UserPreferences {
        const validated: UserPreferences = { ...UserPreferencesManager.DEFAULT_PREFS };

        if (typeof data.theme === 'string' && ['light', 'dark', 'auto'].includes(data.theme)) {
            validated.theme = data.theme;
        }

        if (typeof data.notifications === 'boolean') {
            validated.notifications = data.notifications;
        }

        if (typeof data.language === 'string' && data.language.length >= 2) {
            validated.language = data.language;
        }

        if (typeof data.fontSize === 'number' && data.fontSize >= 8 && data.fontSize <= 32) {
            validated.fontSize = data.fontSize;
        }

        if (typeof data.autoSave === 'boolean') {
            validated.autoSave = data.autoSave;
        }

        return validated;
    }

    public getPreferences(): UserPreferences {
        return { ...this.preferences };
    }

    public updatePreferences(updates: Partial<UserPreferences>): boolean {
        const newPreferences = { ...this.preferences, ...updates };
        const validated = this.validatePreferences(newPreferences);

        if (JSON.stringify(validated) !== JSON.stringify(this.preferences)) {
            this.preferences = validated;
            this.savePreferences();
            return true;
        }
        return false;
    }

    private savePreferences(): void {
        try {
            localStorage.setItem(
                UserPreferencesManager.STORAGE_KEY,
                JSON.stringify(this.preferences)
            );
        } catch (error) {
            console.error('Failed to save preferences:', error);
        }
    }

    public resetToDefaults(): void {
        this.preferences = { ...UserPreferencesManager.DEFAULT_PREFS };
        this.savePreferences();
    }

    public exportPreferences(): string {
        return JSON.stringify(this.preferences, null, 2);
    }

    public importPreferences(jsonString: string): boolean {
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