interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
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
  
  if (prefs.language && typeof prefs.language !== 'string') {
    return false;
  }
  
  return true;
}

function applyUserPreferences(prefs: UserPreferences): void {
  if (!validateUserPreferences(prefs)) {
    throw new Error('Invalid user preferences');
  }
  
  console.log('Applying preferences:', prefs);
  
  if (prefs.theme === 'dark') {
    document.documentElement.classList.add('dark-theme');
  } else if (prefs.theme === 'light') {
    document.documentElement.classList.remove('dark-theme');
  }
}