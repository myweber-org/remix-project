interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

function validateUserPreferences(prefs: Partial<UserPreferences>): boolean {
  const validThemes = ['light', 'dark', 'auto'];
  
  if (prefs.theme && !validThemes.includes(prefs.theme)) {
    return false;
  }
  
  if (prefs.fontSize && (prefs.fontSize < 12 || prefs.fontSize > 24)) {
    return false;
  }
  
  if (prefs.language && typeof prefs.language !== 'string') {
    return false;
  }
  
  if (prefs.notificationsEnabled !== undefined && typeof prefs.notificationsEnabled !== 'boolean') {
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
  fontSize: 16
};