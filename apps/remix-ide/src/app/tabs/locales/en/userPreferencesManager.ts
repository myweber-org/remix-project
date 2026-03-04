import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.boolean().default(true),
  language: z.string().min(2).default('en'),
  resultsPerPage: z.number().min(5).max(100).default(20),
  autoSave: z.boolean().default(false),
  lastUpdated: z.date().optional()
});

type UserPreferences = z.infer<typeof PreferenceSchema>;

const STORAGE_KEY = 'app_preferences_v1';

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
        const result = PreferenceSchema.safeParse({
          ...parsed,
          lastUpdated: parsed.lastUpdated ? new Date(parsed.lastUpdated) : undefined
        });
        return result.success ? result.data : PreferenceSchema.parse({});
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage:', error);
    }
    return PreferenceSchema.parse({});
  }

  private savePreferences(): void {
    try {
      const dataToStore = {
        ...this.preferences,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    try {
      const merged = { ...this.preferences, ...updates };
      const result = PreferenceSchema.safeParse(merged);
      
      if (!result.success) {
        console.error('Invalid preferences update:', result.error);
        return false;
      }

      this.preferences = result.data;
      this.savePreferences();
      return true;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      return false;
    }
  }

  resetToDefaults(): void {
    this.preferences = PreferenceSchema.parse({});
    this.savePreferences();
  }

  hasStoredPreferences(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }

  getLastUpdateTime(): Date | null {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    try {
      const parsed = JSON.parse(stored);
      return parsed.lastUpdated ? new Date(parsed.lastUpdated) : null;
    } catch {
      return null;
    }
  }
}

export { UserPreferencesManager, type UserPreferences };typescript
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

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 32;

class UserPreferencesManager {
    private preferences: UserPreferences;

    constructor(initialPreferences?: Partial<UserPreferences>) {
        this.preferences = { ...DEFAULT_PREFERENCES, ...initialPreferences };
        this.validateAndFixPreferences();
    }

    private validateAndFixPreferences(): void {
        if (!['light', 'dark', 'auto'].includes(this.preferences.theme)) {
            this.preferences.theme = DEFAULT_PREFERENCES.theme;
        }

        if (!VALID_LANGUAGES.includes(this.preferences.language)) {
            this.preferences.language = DEFAULT_PREFERENCES.language;
        }

        if (typeof this.preferences.notifications !== 'boolean') {
            this.preferences.notifications = DEFAULT_PREFERENCES.notifications;
        }

        if (typeof this.preferences.fontSize !== 'number' || 
            this.preferences.fontSize < MIN_FONT_SIZE || 
            this.preferences.fontSize > MAX_FONT_SIZE) {
            this.preferences.fontSize = DEFAULT_PREFERENCES.fontSize;
        }

        if (typeof this.preferences.autoSave !== 'boolean') {
            this.preferences.autoSave = DEFAULT_PREFERENCES.autoSave;
        }
    }

    updatePreferences(updates: Partial<UserPreferences>): void {
        this.preferences = { ...this.preferences, ...updates };
        this.validateAndFixPreferences();
    }

    getPreferences(): Readonly<UserPreferences> {
        return { ...this.preferences };
    }

    resetToDefaults(): void {
        this.preferences = { ...DEFAULT_PREFERENCES };
    }

    exportToJSON(): string {
        return JSON.stringify(this.preferences, null, 2);
    }

    importFromJSON(jsonString: string): boolean {
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