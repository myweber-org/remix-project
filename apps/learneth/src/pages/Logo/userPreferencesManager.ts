interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  fontSize: 14
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
    if (!data || typeof data !== 'object') {
      return { ...DEFAULT_PREFERENCES };
    }

    const prefs = data as Partial<UserPreferences>;
    
    return {
      theme: this.isValidTheme(prefs.theme) ? prefs.theme : DEFAULT_PREFERENCES.theme,
      notifications: typeof prefs.notifications === 'boolean' ? prefs.notifications : DEFAULT_PREFERENCES.notifications,
      language: typeof prefs.language === 'string' ? prefs.language : DEFAULT_PREFERENCES.language,
      fontSize: typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 24 
        ? prefs.fontSize 
        : DEFAULT_PREFERENCES.fontSize
    };
  }

  private isValidTheme(theme: unknown): theme is UserPreferences['theme'] {
    return theme === 'light' || theme === 'dark' || theme === 'auto';
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = {
      ...this.preferences,
      ...updates
    };
    this.savePreferences();
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  isDarkMode(): boolean {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.preferences.theme === 'dark';
  }
}

export const preferencesManager = new UserPreferencesManager();import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).default('friends'),
    searchIndexing: z.boolean().default(true)
  })
});

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

const STORAGE_KEY = 'user_preferences_v1';

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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
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

  exportPreferences(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  importPreferences(json: string): boolean {
    try {
      const parsed = JSON.parse(json);
      this.preferences = UserPreferencesSchema.parse(parsed);
      this.savePreferences();
      return true;
    } catch (error) {
      console.error('Invalid preferences format:', error);
      return false;
    }
  }
}

export const userPreferences = new UserPreferencesManager();import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('light'),
  notifications: z.boolean().default(true),
  language: z.string().min(2).default('en'),
  fontSize: z.number().min(8).max(32).default(14),
  autoSave: z.boolean().default(true),
  lastUpdated: z.date().optional()
});

type UserPreferences = z.infer<typeof PreferenceSchema>;

class PreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences_v1';
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(PreferencesManager.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const result = PreferenceSchema.safeParse({
          ...parsed,
          lastUpdated: parsed.lastUpdated ? new Date(parsed.lastUpdated) : undefined
        });
        return result.success ? result.data : PreferenceSchema.parse({});
      }
    } catch (error) {
      console.warn('Failed to load preferences:', error);
    }
    return PreferenceSchema.parse({});
  }

  private savePreferences(): void {
    try {
      const dataToStore = {
        ...this.preferences,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(PreferencesManager.STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const validated = PreferenceSchema.partial().parse(updates);
    this.preferences = { ...this.preferences, ...validated };
    this.savePreferences();
    return this.preferences;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  resetToDefaults(): UserPreferences {
    this.preferences = PreferenceSchema.parse({});
    this.savePreferences();
    return this.preferences;
  }

  exportPreferences(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  importPreferences(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      const result = PreferenceSchema.safeParse(parsed);
      if (result.success) {
        this.preferences = result.data;
        this.savePreferences();
        return true;
      }
    } catch (error) {
      console.error('Invalid preferences format:', error);
    }
    return false;
  }
}

export { PreferencesManager, type UserPreferences };
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
  autoSaveInterval: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en-US',
  notificationsEnabled: true,
  fontSize: 14,
  autoSaveInterval: 30000
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP'];
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 32;
const MIN_AUTO_SAVE_INTERVAL = 5000;
const MAX_AUTO_SAVE_INTERVAL = 300000;

class UserPreferencesManager {
  private preferences: UserPreferences;
  private storageKey: string;

  constructor(storageKey: string = 'userPreferences') {
    this.storageKey = storageKey;
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validateAndMergePreferences(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private validateAndMergePreferences(partial: Partial<UserPreferences>): UserPreferences {
    const merged = { ...DEFAULT_PREFERENCES, ...partial };

    if (!['light', 'dark', 'auto'].includes(merged.theme)) {
      merged.theme = DEFAULT_PREFERENCES.theme;
    }

    if (!VALID_LANGUAGES.includes(merged.language)) {
      merged.language = DEFAULT_PREFERENCES.language;
    }

    if (typeof merged.notificationsEnabled !== 'boolean') {
      merged.notificationsEnabled = DEFAULT_PREFERENCES.notificationsEnabled;
    }

    if (typeof merged.fontSize !== 'number' || 
        merged.fontSize < MIN_FONT_SIZE || 
        merged.fontSize > MAX_FONT_SIZE) {
      merged.fontSize = DEFAULT_PREFERENCES.fontSize;
    }

    if (typeof merged.autoSaveInterval !== 'number' ||
        merged.autoSaveInterval < MIN_AUTO_SAVE_INTERVAL ||
        merged.autoSaveInterval > MAX_AUTO_SAVE_INTERVAL) {
      merged.autoSaveInterval = DEFAULT_PREFERENCES.autoSaveInterval;
    }

    return merged;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = this.validateAndMergePreferences({
      ...this.preferences,
      ...updates
    });

    const hasChanged = JSON.stringify(newPreferences) !== JSON.stringify(this.preferences);
    
    if (hasChanged) {
      this.preferences = newPreferences;
      this.savePreferences();
      this.notifyPreferencesChange();
    }

    return hasChanged;
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
    this.notifyPreferencesChange();
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences to storage:', error);
    }
  }

  private notifyPreferencesChange(): void {
    const event = new CustomEvent('userPreferencesChanged', {
      detail: { preferences: this.getPreferences() }
    });
    window.dispatchEvent(event);
  }

  getTheme(): UserPreferences['theme'] {
    return this.preferences.theme;
  }

  getLanguage(): string {
    return this.preferences.language;
  }

  areNotificationsEnabled(): boolean {
    return this.preferences.notificationsEnabled;
  }

  getFontSize(): number {
    return this.preferences.fontSize;
  }

  getAutoSaveInterval(): number {
    return this.preferences.autoSaveInterval;
  }
}

export { UserPreferencesManager, DEFAULT_PREFERENCES };
export type { UserPreferences };