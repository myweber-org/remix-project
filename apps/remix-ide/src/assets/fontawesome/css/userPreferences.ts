interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en',
  notifications: true,
  fontSize: 14
};

class PreferencesManager {
  private readonly STORAGE_KEY = 'user_preferences';
  
  private validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = { ...DEFAULT_PREFERENCES, ...prefs };
    
    if (!['light', 'dark', 'auto'].includes(validated.theme)) {
      validated.theme = 'auto';
    }
    
    if (typeof validated.language !== 'string' || validated.language.length === 0) {
      validated.language = 'en';
    }
    
    if (typeof validated.notifications !== 'boolean') {
      validated.notifications = true;
    }
    
    if (typeof validated.fontSize !== 'number' || validated.fontSize < 8 || validated.fontSize > 32) {
      validated.fontSize = 14;
    }
    
    return validated;
  }
  
  savePreferences(prefs: Partial<UserPreferences>): boolean {
    try {
      const validated = this.validatePreferences(prefs);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(validated));
      return true;
    } catch (error) {
      console.error('Failed to save preferences:', error);
      return false;
    }
  }
  
  loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validatePreferences(parsed);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
    
    return { ...DEFAULT_PREFERENCES };
  }
  
  resetToDefaults(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
  
  getCurrentTheme(): 'light' | 'dark' {
    const prefs = this.loadPreferences();
    
    if (prefs.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    return prefs.theme;
  }
}

export const preferencesManager = new PreferencesManager();