interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  timezone: string;
}

function validatePreferences(prefs: UserPreferences): boolean {
  const validThemes = ['light', 'dark', 'auto'];
  const validLanguages = ['en', 'es', 'fr', 'de'];
  
  return (
    validThemes.includes(prefs.theme) &&
    validLanguages.includes(prefs.language) &&
    typeof prefs.notifications === 'boolean' &&
    prefs.timezone.length > 0
  );
}

function savePreferences(prefs: UserPreferences): void {
  if (validatePreferences(prefs)) {
    localStorage.setItem('userPreferences', JSON.stringify(prefs));
    console.log('Preferences saved successfully');
  } else {
    console.error('Invalid preferences');
  }
}

function loadPreferences(): UserPreferences | null {
  const stored = localStorage.getItem('userPreferences');
  if (stored) {
    const prefs = JSON.parse(stored) as UserPreferences;
    if (validatePreferences(prefs)) {
      return prefs;
    }
  }
  return null;
}

export { UserPreferences, validatePreferences, savePreferences, loadPreferences };