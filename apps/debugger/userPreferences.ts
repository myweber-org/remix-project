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

  if (prefs.language !== undefined) {
    const languageRegex = /^[a-z]{2}(-[A-Z]{2})?$/;
    if (!languageRegex.test(prefs.language)) {
      return false;
    }
  }

  return true;
}

function mergePreferences(
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

const defaultPreferences: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  itemsPerPage: 20
};