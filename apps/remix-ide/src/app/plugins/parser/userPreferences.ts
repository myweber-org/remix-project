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

class PreferencesManager {
  private storageKey = 'user_preferences';
  
  validatePreferences(prefs: Partial<UserPreferences>): boolean {
    if (prefs.theme && !['light', 'dark', 'auto'].includes(prefs.theme)) {
      return false;
    }
    
    if (prefs.resultsPerPage && (prefs.resultsPerPage < 5 || prefs.resultsPerPage > 100)) {
      return false;
    }
    
    if (prefs.language && !/^[a-z]{2}-[A-Z]{2}$/.test(prefs.language)) {
      return false;
    }
    
    return true;
  }
  
  loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (this.validatePreferences(parsed)) {
          return { ...DEFAULT_PREFERENCES, ...parsed };
        }
      }
    } catch (error) {
      console.warn('Failed to load preferences:', error);
    }
    
    return { ...DEFAULT_PREFERENCES };
  }
  
  savePreferences(prefs: Partial<UserPreferences>): boolean {
    if (!this.validatePreferences(prefs)) {
      return false;
    }
    
    try {
      const current = this.loadPreferences();
      const updated = { ...current, ...prefs };
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Failed to save preferences:', error);
      return false;
    }
  }
  
  resetToDefaults(): void {
    localStorage.removeItem(this.storageKey);
  }
}

export const preferencesManager = new PreferencesManager();