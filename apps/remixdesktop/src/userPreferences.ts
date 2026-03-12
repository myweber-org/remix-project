interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  itemsPerPage: number;
}

function validateUserPreferences(prefs: Partial<UserPreferences>): boolean {
  const validThemes = ['light', 'dark', 'auto'];
  
  if (prefs.theme && !validThemes.includes(prefs.theme)) {
    return false;
  }
  
  if (prefs.language && typeof prefs.language !== 'string') {
    return false;
  }
  
  if (prefs.notificationsEnabled !== undefined && typeof prefs.notificationsEnabled !== 'boolean') {
    return false;
  }
  
  if (prefs.itemsPerPage !== undefined && (typeof prefs.itemsPerPage !== 'number' || prefs.itemsPerPage < 1 || prefs.itemsPerPage > 100)) {
    return false;
  }
  
  return true;
}

function mergeUserPreferences(defaultPrefs: UserPreferences, userPrefs: Partial<UserPreferences>): UserPreferences {
  if (!validateUserPreferences(userPrefs)) {
    throw new Error('Invalid user preferences provided');
  }
  
  return {
    ...defaultPrefs,
    ...userPrefs
  };
}

const defaultPreferences: UserPreferences = {
  theme: 'auto',
  language: 'en',
  notificationsEnabled: true,
  itemsPerPage: 20
};