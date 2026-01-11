interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private static readonly DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 16
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
      console.warn('Failed to load preferences from storage', error);
    }
    return { ...UserPreferencesManager.DEFAULT_PREFERENCES };
  }

  private validatePreferences(data: unknown): UserPreferences {
    const defaultPrefs = UserPreferencesManager.DEFAULT_PREFERENCES;
    
    if (!data || typeof data !== 'object') {
      return { ...defaultPrefs };
    }

    const prefs = data as Partial<UserPreferences>;
    
    return {
      theme: this.isValidTheme(prefs.theme) ? prefs.theme : defaultPrefs.theme,
      notifications: typeof prefs.notifications === 'boolean' 
        ? prefs.notifications 
        : defaultPrefs.notifications,
      language: typeof prefs.language === 'string' 
        ? prefs.language 
        : defaultPrefs.language,
      fontSize: typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 32
        ? prefs.fontSize
        : defaultPrefs.fontSize
    };
  }

  private isValidTheme(theme: unknown): theme is UserPreferences['theme'] {
    return theme === 'light' || theme === 'dark' || theme === 'auto';
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
      localStorage.setItem(
        UserPreferencesManager.STORAGE_KEY, 
        JSON.stringify(this.preferences)
      );
    } catch (error) {
      console.error('Failed to save preferences to storage', error);
    }
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  hasCustomSettings(): boolean {
    const current = JSON.stringify(this.preferences);
    const defaults = JSON.stringify(UserPreferencesManager.DEFAULT_PREFERENCES);
    return current !== defaults;
  }
}

export { UserPreferencesManager };
export type { UserPreferences };interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor(defaultPreferences?: Partial<UserPreferences>) {
    this.preferences = this.loadPreferences() || this.getDefaultPreferences();
    
    if (defaultPreferences) {
      this.updatePreferences(defaultPreferences);
    }
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      language: 'en-US',
      notificationsEnabled: true,
      fontSize: 16
    };
  }

  private loadPreferences(): UserPreferences | null {
    try {
      const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private savePreferences(): void {
    localStorage.setItem(
      UserPreferencesManager.STORAGE_KEY,
      JSON.stringify(this.preferences)
    );
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const validated = this.validateUpdates(updates);
    
    if (!validated.valid) {
      console.warn('Invalid preferences update:', validated.errors);
      return false;
    }

    this.preferences = { ...this.preferences, ...updates };
    this.savePreferences();
    return true;
  }

  private validateUpdates(updates: Partial<UserPreferences>): { 
    valid: boolean; 
    errors: string[] 
  } {
    const errors: string[] = [];

    if (updates.theme !== undefined && 
        !['light', 'dark', 'auto'].includes(updates.theme)) {
      errors.push('Invalid theme value');
    }

    if (updates.fontSize !== undefined && 
        (updates.fontSize < 8 || updates.fontSize > 32)) {
      errors.push('Font size must be between 8 and 32');
    }

    if (updates.language !== undefined && 
        !/^[a-z]{2}-[A-Z]{2}$/.test(updates.language)) {
      errors.push('Language must be in format xx-XX');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = this.getDefaultPreferences();
    this.savePreferences();
  }

  clearPreferences(): void {
    localStorage.removeItem(UserPreferencesManager.STORAGE_KEY);
    this.preferences = this.getDefaultPreferences();
  }
}

export { UserPreferencesManager, type UserPreferences };