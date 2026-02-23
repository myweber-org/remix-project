interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

function validateUserPreferences(prefs: UserPreferences): void {
  const validThemes = ['light', 'dark', 'auto'];
  
  if (!validThemes.includes(prefs.theme)) {
    throw new PreferenceValidationError(
      `Invalid theme '${prefs.theme}'. Must be one of: ${validThemes.join(', ')}`
    );
  }
  
  if (typeof prefs.notifications !== 'boolean') {
    throw new PreferenceValidationError(
      'Notifications must be a boolean value'
    );
  }
  
  if (!prefs.language || prefs.language.trim().length === 0) {
    throw new PreferenceValidationError(
      'Language must be a non-empty string'
    );
  }
  
  if (prefs.fontSize < 12 || prefs.fontSize > 24) {
    throw new PreferenceValidationError(
      `Font size ${prefs.fontSize} is out of range. Must be between 12 and 24`
    );
  }
}

function saveUserPreferences(prefs: UserPreferences): boolean {
  try {
    validateUserPreferences(prefs);
    console.log('Preferences validated successfully');
    return true;
  } catch (error) {
    if (error instanceof PreferenceValidationError) {
      console.error('Validation failed:', error.message);
      return false;
    }
    throw error;
  }
}