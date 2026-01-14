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
      fontSize: typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 32 
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

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const validatedUpdates = this.validatePreferences({ ...this.currentPreferences, ...updates });
    this.currentPreferences = validatedUpdates;
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(validatedUpdates));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
    
    return this.getPreferences();
  }

  resetToDefaults(): UserPreferences {
    this.currentPreferences = { ...DEFAULT_PREFERENCES };
    
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.warn('Failed to clear preferences from storage:', error);
    }
    
    return this.getPreferences();
  }

  applyPreferences(): void {
    const prefs = this.currentPreferences;
    
    document.documentElement.setAttribute('data-theme', prefs.theme === 'auto' ? 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : 
      prefs.theme
    );
    
    document.documentElement.style.fontSize = `${prefs.fontSize}px`;
    document.documentElement.lang = prefs.language;
  }
}

export const preferencesManager = new PreferencesManager();