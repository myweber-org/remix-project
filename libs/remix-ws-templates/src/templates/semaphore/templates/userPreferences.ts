interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en-US',
  notificationsEnabled: true,
  fontSize: 14
};

class PreferenceManager {
  private readonly STORAGE_KEY = 'user_preferences';
  
  constructor() {
    this.ensureDefaults();
  }

  private ensureDefaults(): void {
    const current = this.loadPreferences();
    const merged = { ...DEFAULT_PREFERENCES, ...current };
    this.savePreferences(merged);
  }

  loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return { ...DEFAULT_PREFERENCES };
      
      const parsed = JSON.parse(stored);
      return this.validatePreferences(parsed);
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  }

  savePreferences(prefs: Partial<UserPreferences>): boolean {
    try {
      const current = this.loadPreferences();
      const updated = { ...current, ...prefs };
      
      if (!this.validatePreferences(updated)) {
        throw new Error('Invalid preference values');
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch {
      return false;
    }
  }

  private validatePreferences(prefs: any): UserPreferences {
    const validated: UserPreferences = { ...DEFAULT_PREFERENCES };
    
    if (prefs.theme && ['light', 'dark', 'auto'].includes(prefs.theme)) {
      validated.theme = prefs.theme;
    }
    
    if (typeof prefs.language === 'string' && prefs.language.length > 0) {
      validated.language = prefs.language;
    }
    
    if (typeof prefs.notificationsEnabled === 'boolean') {
      validated.notificationsEnabled = prefs.notificationsEnabled;
    }
    
    if (typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 32) {
      validated.fontSize = prefs.fontSize;
    }
    
    return validated;
  }

  resetToDefaults(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.ensureDefaults();
  }

  getCurrentTheme(): string {
    const prefs = this.loadPreferences();
    if (prefs.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return prefs.theme;
  }
}

export const preferenceManager = new PreferenceManager();
export type { UserPreferences };