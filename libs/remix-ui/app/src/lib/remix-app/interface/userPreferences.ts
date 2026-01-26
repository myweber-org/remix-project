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

function applyUserPreferences(prefs: UserPreferences): void {
  console.log('Applying user preferences:', prefs);
  
  if (prefs.theme === 'dark') {
    document.body.classList.add('dark-theme');
  } else if (prefs.theme === 'light') {
    document.body.classList.remove('dark-theme');
  }
  
  localStorage.setItem('userPreferences', JSON.stringify(prefs));
}

export { UserPreferences, validateUserPreferences, applyUserPreferences };