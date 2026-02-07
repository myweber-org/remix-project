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
  private readonly STORAGE_KEY = 'user_preferences';
  
  constructor() {
    this.ensureDefaults();
  }

  getPreferences(): UserPreferences {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return { ...DEFAULT_PREFERENCES };
    
    try {
      const parsed = JSON.parse(stored);
      return this.validateAndMerge(parsed);
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const merged = { ...current, ...updates };
    const validated = this.validateAndMerge(merged);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(validated));
    return validated;
  }

  resetToDefaults(): UserPreferences {
    localStorage.removeItem(this.STORAGE_KEY);
    return this.getPreferences();
  }

  private validateAndMerge(prefs: any): UserPreferences {
    const result = { ...DEFAULT_PREFERENCES };
    
    if (prefs && typeof prefs === 'object') {
      if (['light', 'dark', 'auto'].includes(prefs.theme)) {
        result.theme = prefs.theme;
      }
      
      if (typeof prefs.notifications === 'boolean') {
        result.notifications = prefs.notifications;
      }
      
      if (typeof prefs.language === 'string' && prefs.language.length >= 2) {
        result.language = prefs.language;
      }
      
      if (typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 32) {
        result.fontSize = prefs.fontSize;
      }
    }
    
    return result;
  }

  private ensureDefaults(): void {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(DEFAULT_PREFERENCES));
    }
  }
}

export { PreferencesManager, type UserPreferences };