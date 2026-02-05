interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

function validateUserPreferences(prefs: Partial<UserPreferences>): boolean {
  const validThemes = ['light', 'dark', 'auto'];
  
  if (prefs.theme && !validThemes.includes(prefs.theme)) {
    return false;
  }
  
  if (prefs.itemsPerPage !== undefined) {
    if (!Number.isInteger(prefs.itemsPerPage) || prefs.itemsPerPage < 1 || prefs.itemsPerPage > 100) {
      return false;
    }
  }
  
  if (prefs.language !== undefined) {
    const validLanguages = ['en', 'es', 'fr', 'de'];
    if (!validLanguages.includes(prefs.language)) {
      return false;
    }
  }
  
  return true;
}

function updateUserPreferences(current: UserPreferences, updates: Partial<UserPreferences>): UserPreferences | null {
  if (!validateUserPreferences(updates)) {
    return null;
  }
  
  return {
    ...current,
    ...updates
  };
}

const defaultPreferences: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  itemsPerPage: 20
};