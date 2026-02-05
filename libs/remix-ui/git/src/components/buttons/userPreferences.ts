interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  itemsPerPage: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en-US',
  notificationsEnabled: true,
  itemsPerPage: 25
};

function validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const validated: UserPreferences = { ...DEFAULT_PREFERENCES, ...prefs };
  
  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    validated.theme = 'auto';
  }
  
  if (typeof validated.language !== 'string' || validated.language.trim().length === 0) {
    validated.language = 'en-US';
  }
  
  if (typeof validated.notificationsEnabled !== 'boolean') {
    validated.notificationsEnabled = true;
  }
  
  if (!Number.isInteger(validated.itemsPerPage) || validated.itemsPerPage < 1 || validated.itemsPerPage > 100) {
    validated.itemsPerPage = 25;
  }
  
  return validated;
}

function mergePreferences(existing: UserPreferences, updates: Partial<UserPreferences>): UserPreferences {
  return validatePreferences({ ...existing, ...updates });
}

export { UserPreferences, DEFAULT_PREFERENCES, validatePreferences, mergePreferences };interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
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

  loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validatePreferences(parsed) 
          ? { ...DEFAULT_PREFERENCES, ...parsed }
          : DEFAULT_PREFERENCES;
      }
    } catch (error) {
      console.warn('Failed to load preferences:', error);
    }
    return DEFAULT_PREFERENCES;
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

export const preferenceManager = new PreferenceManager();interface UserPreferences {
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
    this.initializePreferences();
  }

  private initializePreferences(): void {
    if (!this.getStoredPreferences()) {
      this.savePreferences(DEFAULT_PREFERENCES);
    }
  }

  getPreferences(): UserPreferences {
    const stored = this.getStoredPreferences();
    return { ...DEFAULT_PREFERENCES, ...stored };
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const updated = this.validatePreferences({ ...current, ...updates });
    this.savePreferences(updated);
    return updated;
  }

  resetToDefaults(): UserPreferences {
    this.savePreferences(DEFAULT_PREFERENCES);
    return DEFAULT_PREFERENCES;
  }

  private validatePreferences(prefs: UserPreferences): UserPreferences {
    const validThemes: UserPreferences['theme'][] = ['light', 'dark', 'auto'];
    const validated: UserPreferences = {
      ...prefs,
      theme: validThemes.includes(prefs.theme) ? prefs.theme : 'auto',
      fontSize: Math.max(8, Math.min(72, prefs.fontSize))
    };
    return validated;
  }

  private getStoredPreferences(): Partial<UserPreferences> | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private savePreferences(prefs: UserPreferences): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(prefs));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }
}

export const preferencesManager = new PreferencesManager();