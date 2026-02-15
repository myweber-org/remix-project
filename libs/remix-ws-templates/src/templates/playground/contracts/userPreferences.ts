interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

function validatePreferences(prefs: UserPreferences): boolean {
  const validThemes = ['light', 'dark', 'auto'];
  const minFontSize = 8;
  const maxFontSize = 72;

  if (!validThemes.includes(prefs.theme)) {
    return false;
  }

  if (typeof prefs.notifications !== 'boolean') {
    return false;
  }

  if (typeof prefs.language !== 'string' || prefs.language.trim().length === 0) {
    return false;
  }

  if (typeof prefs.fontSize !== 'number' || 
      prefs.fontSize < minFontSize || 
      prefs.fontSize > maxFontSize) {
    return false;
  }

  return true;
}

function updateUserPreferences(prefs: UserPreferences): void {
  if (!validatePreferences(prefs)) {
    throw new Error('Invalid preferences provided');
  }
  
  console.log('Preferences updated successfully:', prefs);
}

const defaultPreferences: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  fontSize: 16
};