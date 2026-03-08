interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  resultsPerPage: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  resultsPerPage: 20
};

function validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const validated: UserPreferences = { ...DEFAULT_PREFERENCES, ...prefs };
  
  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    validated.theme = 'auto';
  }
  
  if (typeof validated.notifications !== 'boolean') {
    validated.notifications = true;
  }
  
  if (!validated.language || typeof validated.language !== 'string') {
    validated.language = 'en-US';
  }
  
  if (typeof validated.resultsPerPage !== 'number' || 
      validated.resultsPerPage < 5 || 
      validated.resultsPerPage > 100) {
    validated.resultsPerPage = 20;
  }
  
  return validated;
}

function savePreferences(prefs: Partial<UserPreferences>): void {
  const validated = validatePreferences(prefs);
  localStorage.setItem('userPreferences', JSON.stringify(validated));
}

function loadPreferences(): UserPreferences {
  const stored = localStorage.getItem('userPreferences');
  if (!stored) {
    return DEFAULT_PREFERENCES;
  }
  
  try {
    const parsed = JSON.parse(stored);
    return validatePreferences(parsed);
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export { UserPreferences, validatePreferences, savePreferences, loadPreferences };import { z } from 'zod';

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).default('public'),
    searchIndexing: z.boolean().default(true)
  }),
  language: z.string().min(2).default('en')
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export const DEFAULT_PREFERENCES: UserPreferences = UserPreferencesSchema.parse({});

export function validatePreferences(input: unknown): UserPreferences {
  return UserPreferencesSchema.parse(input);
}

export function mergePreferences(current: UserPreferences, updates: Partial<UserPreferences>): UserPreferences {
  const merged = { ...current, ...updates };
  return validatePreferences(merged);
}interface UserPreferences {
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

class PreferencesManager {
  private storageKey = 'user_preferences';
  private currentPreferences: UserPreferences;

  constructor() {
    this.currentPreferences = this.loadPreferences();
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
    return { ...this.currentPreferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = {
      ...this.currentPreferences,
      ...this.validatePreferences(updates)
    };

    if (JSON.stringify(newPreferences) !== JSON.stringify(this.currentPreferences)) {
      this.currentPreferences = newPreferences;
      this.savePreferences();
      return true;
    }
    return false;
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.currentPreferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  resetToDefaults(): void {
    this.currentPreferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  exportPreferences(): string {
    return JSON.stringify(this.currentPreferences, null, 2);
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

export const preferencesManager = new PreferencesManager();