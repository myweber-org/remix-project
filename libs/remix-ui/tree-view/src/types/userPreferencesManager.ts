
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

const STORAGE_KEY = 'user_preferences';

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const validatedUpdates = this.validateUpdates(updates);
    this.preferences = { ...this.preferences, ...validatedUpdates };
    this.savePreferences();
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  private validateUpdates(updates: Partial<UserPreferences>): Partial<UserPreferences> {
    const validated: Partial<UserPreferences> = {};

    if (updates.theme !== undefined) {
      if (['light', 'dark', 'auto'].includes(updates.theme)) {
        validated.theme = updates.theme as UserPreferences['theme'];
      }
    }

    if (updates.notifications !== undefined) {
      validated.notifications = Boolean(updates.notifications);
    }

    if (updates.language !== undefined) {
      if (typeof updates.language === 'string' && updates.language.length >= 2) {
        validated.language = updates.language;
      }
    }

    if (updates.fontSize !== undefined) {
      const size = Number(updates.fontSize);
      if (!isNaN(size) && size >= 8 && size <= 24) {
        validated.fontSize = size;
      }
    }

    return validated;
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
}

export const userPreferences = new UserPreferencesManager();interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notificationsEnabled: boolean;
  itemsPerPage: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private defaultPreferences: UserPreferences = {
    theme: 'light',
    language: 'en',
    notificationsEnabled: true,
    itemsPerPage: 10
  };

  getPreferences(): UserPreferences {
    const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
    if (!stored) {
      return this.defaultPreferences;
    }

    try {
      const parsed = JSON.parse(stored);
      return this.validatePreferences(parsed);
    } catch {
      return this.defaultPreferences;
    }
  }

  savePreferences(preferences: Partial<UserPreferences>): void {
    const current = this.getPreferences();
    const updated = { ...current, ...preferences };
    
    if (this.validatePreferences(updated)) {
      localStorage.setItem(
        UserPreferencesManager.STORAGE_KEY,
        JSON.stringify(updated)
      );
    }
  }

  resetToDefaults(): void {
    localStorage.removeItem(UserPreferencesManager.STORAGE_KEY);
  }

  private validatePreferences(data: unknown): UserPreferences {
    if (!data || typeof data !== 'object') {
      return this.defaultPreferences;
    }

    const prefs = data as Record<string, unknown>;
    
    return {
      theme: this.isValidTheme(prefs.theme) ? prefs.theme : this.defaultPreferences.theme,
      language: typeof prefs.language === 'string' ? prefs.language : this.defaultPreferences.language,
      notificationsEnabled: typeof prefs.notificationsEnabled === 'boolean' 
        ? prefs.notificationsEnabled 
        : this.defaultPreferences.notificationsEnabled,
      itemsPerPage: typeof prefs.itemsPerPage === 'number' 
        ? Math.max(5, Math.min(100, prefs.itemsPerPage))
        : this.defaultPreferences.itemsPerPage
    };
  }

  private isValidTheme(theme: unknown): theme is 'light' | 'dark' {
    return theme === 'light' || theme === 'dark';
  }
}

export const userPreferences = new UserPreferencesManager();interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return this.validatePreferences(parsed);
      } catch {
        return this.getDefaultPreferences();
      }
    }
    return this.getDefaultPreferences();
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 14
    };
  }

  private validatePreferences(data: any): UserPreferences {
    const defaults = this.getDefaultPreferences();
    
    return {
      theme: ['light', 'dark', 'auto'].includes(data.theme) ? data.theme : defaults.theme,
      notifications: typeof data.notifications === 'boolean' ? data.notifications : defaults.notifications,
      language: typeof data.language === 'string' && data.language.length === 2 ? data.language : defaults.language,
      fontSize: typeof data.fontSize === 'number' && data.fontSize >= 10 && data.fontSize <= 24 ? data.fontSize : defaults.fontSize
    };
  }

  public getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  public updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = {
      ...this.preferences,
      ...updates
    };
    this.preferences = this.validatePreferences(this.preferences);
    this.savePreferences();
  }

  private savePreferences(): void {
    localStorage.setItem(
      UserPreferencesManager.STORAGE_KEY,
      JSON.stringify(this.preferences)
    );
  }

  public resetToDefaults(): void {
    this.preferences = this.getDefaultPreferences();
    this.savePreferences();
  }

  public isDarkMode(): boolean {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.preferences.theme === 'dark';
  }
}

export { UserPreferencesManager, type UserPreferences };
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private static readonly DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    language: 'en',
    notificationsEnabled: true,
    fontSize: 14
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
    return { ...UserPreferencesManager.DEFAULT_PREFERENCES };
  }

  private validateAndMerge(partial: Partial<UserPreferences>): UserPreferences {
    const merged = { ...UserPreferencesManager.DEFAULT_PREFERENCES, ...partial };
    
    if (!['light', 'dark', 'auto'].includes(merged.theme)) {
      merged.theme = 'auto';
    }
    
    if (typeof merged.language !== 'string' || merged.language.trim().length === 0) {
      merged.language = 'en';
    }
    
    if (typeof merged.notificationsEnabled !== 'boolean') {
      merged.notificationsEnabled = true;
    }
    
    if (typeof merged.fontSize !== 'number' || merged.fontSize < 8 || merged.fontSize > 32) {
      merged.fontSize = 14;
    }
    
    return merged;
  }

  public getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  public updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = this.validateAndMerge({ ...this.preferences, ...updates });
    this.savePreferences();
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
    this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  public isDarkMode(): boolean {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.preferences.theme === 'dark';
  }
}

export { UserPreferencesManager, type UserPreferences };