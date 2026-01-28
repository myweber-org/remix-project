interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

function savePreferences(prefs: UserPreferences): void {
  localStorage.setItem('userPreferences', JSON.stringify(prefs));
}

function loadPreferences(): UserPreferences | null {
  const data = localStorage.getItem('userPreferences');
  if (!data) return null;
  
  try {
    return JSON.parse(data) as UserPreferences;
  } catch {
    return null;
  }
}

function validatePreferences(prefs: any): prefs is UserPreferences {
  return (
    prefs &&
    typeof prefs === 'object' &&
    ['light', 'dark', 'auto'].includes(prefs.theme) &&
    typeof prefs.language === 'string' &&
    typeof prefs.notificationsEnabled === 'boolean' &&
    typeof prefs.fontSize === 'number' &&
    prefs.fontSize >= 8 &&
    prefs.fontSize <= 32
  );
}

export { UserPreferences, savePreferences, loadPreferences, validatePreferences };