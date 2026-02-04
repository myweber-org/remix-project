interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

function validateUserPreferences(prefs: UserPreferences): boolean {
  const validThemes = ['light', 'dark', 'auto'];
  const validLanguages = ['en', 'es', 'fr', 'de', 'ja'];
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

function validateUserPreferences(prefs: Partial<UserPreferences>): boolean {
  const validThemes = ['light', 'dark', 'auto'];
  
  if (prefs.theme && !validThemes.includes(prefs.theme)) {
    return false;
  }
  
  if (prefs.fontSize && (prefs.fontSize < 8 || prefs.fontSize > 72)) {
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

function applyUserPreferences(prefs: UserPreferences): void {
  if (prefs.theme === 'dark') {
    document.documentElement.classList.add('dark-theme');
  } else if (prefs.theme === 'light') {
    document.documentElement.classList.remove('dark-theme');
  }
  
  console.log(`Preferences applied: ${JSON.stringify(prefs)}`);
}

const defaultPreferences: UserPreferences = {
  theme: 'auto',
  language: 'en',
  notificationsEnabled: true,
  fontSize: 16
};

export { UserPreferences, validateUserPreferences, applyUserPreferences, defaultPreferences };