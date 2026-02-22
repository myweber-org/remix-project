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

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
const MIN_RESULTS_PER_PAGE = 5;
const MAX_RESULTS_PER_PAGE = 100;

function validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const validated: UserPreferences = { ...DEFAULT_PREFERENCES, ...prefs };

  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    validated.theme = DEFAULT_PREFERENCES.theme;
  }

  if (!VALID_LANGUAGES.includes(validated.language)) {
    validated.language = DEFAULT_PREFERENCES.language;
  }

  if (typeof validated.notifications !== 'boolean') {
    validated.notifications = DEFAULT_PREFERENCES.notifications;
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

export { UserPreferences, validatePreferences, savePreferences, loadPreferences };interface UserPreferences {
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

  loadPreferences(): UserPreferences {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return { ...DEFAULT_PREFERENCES };

    try {
      const parsed = JSON.parse(stored);
      return this.validatePreferences(parsed);
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  }

  savePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    const current = this.loadPreferences();
    const merged = { ...current, ...prefs };
    const validated = this.validatePreferences(merged);
    
    localStorage.setItem(this.storageKey, JSON.stringify(validated));
    return validated;
  }

  resetPreferences(): UserPreferences {
    localStorage.removeItem(this.storageKey);
    return { ...DEFAULT_PREFERENCES };
  }

  private validatePreferences(prefs: any): UserPreferences {
    const validThemes = ['light', 'dark', 'auto'];
    const theme = validThemes.includes(prefs.theme) ? prefs.theme : DEFAULT_PREFERENCES.theme;
    
    const notifications = typeof prefs.notifications === 'boolean' 
      ? prefs.notifications 
      : DEFAULT_PREFERENCES.notifications;
    
    const language = typeof prefs.language === 'string' && prefs.language.length >= 2
      ? prefs.language
      : DEFAULT_PREFERENCES.language;
    
    const fontSize = typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 32
      ? prefs.fontSize
      : DEFAULT_PREFERENCES.fontSize;

    return { theme, notifications, language, fontSize };
  }
}

export const preferencesManager = new PreferencesManager();