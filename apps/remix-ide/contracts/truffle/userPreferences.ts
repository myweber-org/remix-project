interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

function validatePreferences(prefs: Partial<UserPreferences>): boolean {
  const validThemes = ['light', 'dark', 'auto'];
  
  if (prefs.theme && !validThemes.includes(prefs.theme)) {
    return false;
  }
  
  if (prefs.itemsPerPage !== undefined) {
    if (!Number.isInteger(prefs.itemsPerPage) || prefs.itemsPerPage < 1 || prefs.itemsPerPage > 100) {
      return false;
    }
  }
  
  if (prefs.language && typeof prefs.language !== 'string') {
    return false;
  }
  
  return true;
}

function mergePreferences(defaultPrefs: UserPreferences, userPrefs: Partial<UserPreferences>): UserPreferences {
  if (!validatePreferences(userPrefs)) {
    throw new Error('Invalid user preferences provided');
  }
  
  return {
    ...defaultPrefs,
    ...userPrefs
  };
}

const defaultPreferences: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  itemsPerPage: 20
};