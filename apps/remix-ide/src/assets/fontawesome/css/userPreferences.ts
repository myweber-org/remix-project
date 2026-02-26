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

export const preferencesManager = new PreferencesManager();interface UserPreferences {
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

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
const MIN_RESULTS_PER_PAGE = 10;
const MAX_RESULTS_PER_PAGE = 100;

function validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const validated = { ...DEFAULT_PREFERENCES, ...prefs };
  
  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    validated.theme = DEFAULT_PREFERENCES.theme;
  }
  
  if (typeof validated.notifications !== 'boolean') {
    validated.notifications = DEFAULT_PREFERENCES.notifications;
  }
  
  if (!VALID_LANGUAGES.includes(validated.language)) {
    validated.language = DEFAULT_PREFERENCES.language;
  }
  
  if (typeof validated.resultsPerPage !== 'number' || 
      validated.resultsPerPage < MIN_RESULTS_PER_PAGE || 
      validated.resultsPerPage > MAX_RESULTS_PER_PAGE) {
    validated.resultsPerPage = DEFAULT_PREFERENCES.resultsPerPage;
  }
  
  return validated;
}

function savePreferences(prefs: Partial<UserPreferences>): void {
  const validated = validatePreferences(prefs);
  localStorage.setItem('userPreferences', JSON.stringify(validated));
}

function loadPreferences(): UserPreferences {
  const stored = localStorage.getItem('userPreferences');
  if (!stored) return DEFAULT_PREFERENCES;
  
  try {
    const parsed = JSON.parse(stored);
    return validatePreferences(parsed);
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export { UserPreferences, validatePreferences, savePreferences, loadPreferences };