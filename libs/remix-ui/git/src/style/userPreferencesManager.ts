import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.boolean().default(true),
  language: z.string().min(2).default('en'),
  resultsPerPage: z.number().min(5).max(100).default(25),
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

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const validated = UserPreferencesSchema.partial().parse(updates);
    this.preferences = { ...this.preferences, ...validated };
    this.savePreferences();
    return this.getPreferences();
  }

  resetToDefaults(): UserPreferences {
    this.preferences = UserPreferencesSchema.parse({});
    this.savePreferences();
    return this.getPreferences();
  }

  validateExternalData(data: unknown): UserPreferences {
    return UserPreferencesSchema.parse(data);
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

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en-US',
    fontSize: 14,
    autoSave: true
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 32;

class UserPreferencesManager {
    private preferences: UserPreferences;

    constructor(initialPreferences?: Partial<UserPreferences>) {
        this.preferences = { ...DEFAULT_PREFERENCES, ...initialPreferences };
        this.validateAndNormalize();
    }

    private validateAndNormalize(): void {
        if (!['light', 'dark', 'auto'].includes(this.preferences.theme)) {
            this.preferences.theme = DEFAULT_PREFERENCES.theme;
        }

        if (!VALID_LANGUAGES.includes(this.preferences.language)) {
            this.preferences.language = DEFAULT_PREFERENCES.language;
        }

        if (typeof this.preferences.fontSize !== 'number' || 
            this.preferences.fontSize < MIN_FONT_SIZE || 
            this.preferences.fontSize > MAX_FONT_SIZE) {
            this.preferences.fontSize = DEFAULT_PREFERENCES.fontSize;
        }

        this.preferences.notifications = Boolean(this.preferences.notifications);
        this.preferences.autoSave = Boolean(this.preferences.autoSave);
    }

    updatePreferences(updates: Partial<UserPreferences>): void {
        this.preferences = { ...this.preferences, ...updates };
        this.validateAndNormalize();
    }

    getPreferences(): Readonly<UserPreferences> {
        return { ...this.preferences };
    }

    resetToDefaults(): void {
        this.preferences = { ...DEFAULT_PREFERENCES };
    }

    exportPreferences(): string {
        return JSON.stringify(this.preferences, null, 2);
    }

    importPreferences(jsonString: string): boolean {
        try {
            const parsed = JSON.parse(jsonString);
            this.updatePreferences(parsed);
            return true;
        } catch {
            return false;
        }
    }

    isDarkModePreferred(): boolean {
        if (this.preferences.theme === 'dark') return true;
        if (this.preferences.theme === 'light') return false;
        
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
}

export { UserPreferencesManager, type UserPreferences };
```