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
  private storageKey = 'user_preferences';
  
  validatePreferences(prefs: Partial<UserPreferences>): boolean {
    if (prefs.theme && !['light', 'dark', 'auto'].includes(prefs.theme)) {
      return false;
    }
    
    if (prefs.fontSize && (prefs.fontSize < 8 || prefs.fontSize > 32)) {
      return false;
    }
    
    if (prefs.language && typeof prefs.language !== 'string') {
      return false;
    }
    
    return true;
  }
  
  savePreferences(prefs: Partial<UserPreferences>): boolean {
    if (!this.validatePreferences(prefs)) {
      return false;
    }
    
    const current = this.loadPreferences();
    const updated = { ...current, ...prefs };
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
      return true;
    } catch {
      return false;
    }
  }
  
  loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    } catch {
      console.warn('Failed to load preferences from storage');
    }
    
    return { ...DEFAULT_PREFERENCES };
  }
  
  resetToDefaults(): void {
    localStorage.removeItem(this.storageKey);
  }
  
  getPreference<K extends keyof UserPreferences>(key: K): UserPreferences[K] {
    const prefs = this.loadPreferences();
    return prefs[key];
  }
}

export const preferenceManager = new PreferenceManager();