interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

function validateUserPreferences(prefs: UserPreferences): boolean {
  const validThemes = ['light', 'dark', 'auto'];
  const validLanguages = ['en', 'es', 'fr', 'de'];
  const timezoneRegex = /^[A-Za-z_]+\/[A-Za-z_]+$/;

  if (!validThemes.includes(prefs.theme)) {
    return false;
  }

  if (typeof prefs.notifications !== 'boolean') {
    return false;
  }

  if (!validLanguages.includes(prefs.language)) {
    return false;
  }

  if (!timezoneRegex.test(prefs.timezone)) {
    return false;
  }

  return true;
}

function updateUserPreferences(newPrefs: Partial<UserPreferences>): UserPreferences {
  const defaultPreferences: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    timezone: 'UTC'
  };

  const mergedPreferences = { ...defaultPreferences, ...newPrefs };
  
  if (!validateUserPreferences(mergedPreferences)) {
    throw new Error('Invalid user preferences provided');
  }

  return mergedPreferences;
}interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

function validatePreferences(prefs: UserPreferences): boolean {
  const validThemes = ['light', 'dark', 'auto'];
  const minFontSize = 8;
  const maxFontSize = 72;

  if (!validThemes.includes(prefs.theme)) {
    return false;
  }

  if (typeof prefs.language !== 'string' || prefs.language.trim().length === 0) {
    return false;
  }

  if (typeof prefs.notificationsEnabled !== 'boolean') {
    return false;
  }

  if (typeof prefs.fontSize !== 'number' || 
      prefs.fontSize < minFontSize || 
      prefs.fontSize > maxFontSize) {
    return false;
  }

  return true;
}

function applyPreferences(prefs: UserPreferences): void {
  if (!validatePreferences(prefs)) {
    throw new Error('Invalid preferences provided');
  }

  document.documentElement.setAttribute('data-theme', prefs.theme);
  document.documentElement.lang = prefs.language;
  
  const root = document.documentElement;
  root.style.setProperty('--font-size', `${prefs.fontSize}px`);
  
  console.log(`Preferences applied: ${JSON.stringify(prefs)}`);
}

export { UserPreferences, validatePreferences, applyPreferences };