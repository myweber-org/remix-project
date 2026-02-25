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

function validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

  if (prefs.theme && ['light', 'dark', 'auto'].includes(prefs.theme)) {
    validated.theme = prefs.theme;
  }

  if (typeof prefs.notifications === 'boolean') {
    validated.notifications = prefs.notifications;
  }

  if (prefs.language && typeof prefs.language === 'string') {
    validated.language = prefs.language;
  }

  if (prefs.resultsPerPage && Number.isInteger(prefs.resultsPerPage) && prefs.resultsPerPage > 0) {
    validated.resultsPerPage = Math.min(prefs.resultsPerPage, 100);
  }

  return validated;
}

function mergePreferences(existing: UserPreferences, updates: Partial<UserPreferences>): UserPreferences {
  return validatePreferences({ ...existing, ...updates });
}

export { UserPreferences, DEFAULT_PREFERENCES, validatePreferences, mergePreferences };interface UserPreferences {
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

class UserPreferencesService {
  private readonly STORAGE_KEY = 'user_preferences';
  
  constructor() {
    this.ensurePreferencesExist();
  }

  getPreferences(): UserPreferences {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      return DEFAULT_PREFERENCES;
    }
    
    try {
      const parsed = JSON.parse(stored);
      return this.validateAndMerge(parsed);
    } catch {
      return DEFAULT_PREFERENCES;
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
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(DEFAULT_PREFERENCES));
    return DEFAULT_PREFERENCES;
  }

  private ensurePreferencesExist(): void {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      this.resetToDefaults();
    }
  }

  private validateAndMerge(prefs: any): UserPreferences {
    const validThemes = ['light', 'dark', 'auto'];
    const theme = validThemes.includes(prefs.theme) ? prefs.theme : DEFAULT_PREFERENCES.theme;
    
    const language = typeof prefs.language === 'string' && prefs.language.length > 0 
      ? prefs.language 
      : DEFAULT_PREFERENCES.language;
    
    const notificationsEnabled = typeof prefs.notificationsEnabled === 'boolean'
      ? prefs.notificationsEnabled
      : DEFAULT_PREFERENCES.notificationsEnabled;
    
    const fontSize = typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 32
      ? prefs.fontSize
      : DEFAULT_PREFERENCES.fontSize;

    return {
      theme,
      language,
      notificationsEnabled,
      fontSize
    };
  }
}

export const userPreferencesService = new UserPreferencesService();