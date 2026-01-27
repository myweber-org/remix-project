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
      const validated = this.validatePreferences(updated);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(validated));
      return true;
    } catch {
      return false;
    }
  }
  
  private validatePreferences(prefs: any): UserPreferences {
    const result = { ...DEFAULT_PREFERENCES };
    
    if (prefs.theme && ['light', 'dark', 'auto'].includes(prefs.theme)) {
      result.theme = prefs.theme;
    }
    
    if (typeof prefs.notifications === 'boolean') {
      result.notifications = prefs.notifications;
    }
    
    if (typeof prefs.language === 'string' && prefs.language.length >= 2) {
      result.language = prefs.language;
    }
    
    if (typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 24) {
      result.fontSize = Math.round(prefs.fontSize);
    }
    
    return result;
  }
  
  resetToDefaults(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.ensureDefaults();
  }
}

export { PreferenceManager, type UserPreferences };