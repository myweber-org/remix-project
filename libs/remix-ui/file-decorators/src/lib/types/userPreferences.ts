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
  const validated = { ...DEFAULT_PREFERENCES, ...prefs };
  
  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    validated.theme = 'auto';
  }
  
  if (typeof validated.notifications !== 'boolean') {
    validated.notifications = true;
  }
  
  if (!validated.language || typeof validated.language !== 'string') {
    validated.language = 'en-US';
  }
  
  if (typeof validated.resultsPerPage !== 'number' || 
      validated.resultsPerPage < 5 || 
      validated.resultsPerPage > 100) {
    validated.resultsPerPage = 20;
  }
  
  return validated;
}

function savePreferences(prefs: Partial<UserPreferences>): void {
  const validated = validatePreferences(prefs);
  localStorage.setItem('userPreferences', JSON.stringify(validated));
}

function loadPreferences(): UserPreferences {
  const stored = localStorage.getItem('userPreferences');
  if (!stored) {
    return DEFAULT_PREFERENCES;
  }
  
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
  timezone: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  timezone: 'UTC'
};

function validatePreferences(prefs: Partial<UserPreferences>): boolean {
  const validThemes = ['light', 'dark', 'auto'];
  
  if (prefs.theme && !validThemes.includes(prefs.theme)) {
    return false;
  }
  
  if (prefs.language && typeof prefs.language !== 'string') {
    return false;
  }
  
  if (prefs.timezone && typeof prefs.timezone !== 'string') {
    return false;
  }
  
  return true;
}

function updateUserPreferences(
  current: UserPreferences,
  updates: Partial<UserPreferences>
): UserPreferences | null {
  if (!validatePreferences(updates)) {
    return null;
  }
  
  return {
    ...current,
    ...updates
  };
}

function savePreferences(prefs: UserPreferences): void {
  localStorage.setItem('userPreferences', JSON.stringify(prefs));
}

function loadPreferences(): UserPreferences {
  const stored = localStorage.getItem('userPreferences');
  
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (validatePreferences(parsed)) {
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    } catch {
      console.warn('Failed to parse stored preferences');
    }
  }
  
  return DEFAULT_PREFERENCES;
}

export {
  UserPreferences,
  validatePreferences,
  updateUserPreferences,
  savePreferences,
  loadPreferences
};