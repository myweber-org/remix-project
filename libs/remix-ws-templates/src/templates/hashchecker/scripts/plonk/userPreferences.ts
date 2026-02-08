interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

function validateUserPreferences(prefs: Partial<UserPreferences>): boolean {
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
  
  if (prefs.notifications !== undefined && typeof prefs.notifications !== 'boolean') {
    return false;
  }
  
  return true;
}

function updateUserPreferences(current: UserPreferences, updates: Partial<UserPreferences>): UserPreferences {
  if (!validateUserPreferences(updates)) {
    throw new Error('Invalid preference updates');
  }
  
  return {
    ...current,
    ...updates
  };
}

export { UserPreferences, validateUserPreferences, updateUserPreferences };