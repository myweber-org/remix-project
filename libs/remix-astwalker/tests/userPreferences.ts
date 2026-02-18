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

  if (prefs.fontSize !== undefined && (prefs.fontSize < 12 || prefs.fontSize > 24)) {
    return false;
  }

  if (prefs.language !== undefined && typeof prefs.language !== 'string') {
    return false;
  }

  if (prefs.notificationsEnabled !== undefined && typeof prefs.notificationsEnabled !== 'boolean') {
    return false;
  }

  return true;
}

function applyUserPreferences(prefs: UserPreferences): void {
  console.log('Applying user preferences:', prefs);
  
  document.documentElement.setAttribute('data-theme', prefs.theme);
  document.documentElement.style.fontSize = `${prefs.fontSize}px`;
  
  if (prefs.notificationsEnabled) {
    console.log('Notifications enabled for language:', prefs.language);
  }
}

export { UserPreferences, validateUserPreferences, applyUserPreferences };