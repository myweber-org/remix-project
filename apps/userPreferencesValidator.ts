interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
  fontSize: number;
}

class PreferenceValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly VALID_TIMEZONES = /^[A-Za-z_]+\/[A-Za-z_]+$/;
  
  static validate(prefs: UserPreferences): string[] {
    const errors: string[] = [];
    
    if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
      errors.push('Theme must be light, dark, or auto');
    }
    
    if (typeof prefs.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }
    
    if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
      errors.push(`Language must be one of: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
    }
    
    if (!PreferenceValidator.VALID_TIMEZONES.test(prefs.timezone)) {
      errors.push('Timezone must be in format Area/Location (e.g., America/New_York)');
    }
    
    if (prefs.fontSize < 12 || prefs.fontSize > 24) {
      errors.push('Font size must be between 12 and 24');
    }
    
    return errors;
  }
  
  static normalize(prefs: Partial<UserPreferences>): UserPreferences {
    return {
      theme: prefs.theme || 'auto',
      notifications: prefs.notifications ?? true,
      language: prefs.language || 'en',
      timezone: prefs.timezone || 'UTC',
      fontSize: prefs.fontSize || 16
    };
  }
}

function validateUserPreferences(prefs: Partial<UserPreferences>): {
  isValid: boolean;
  normalized: UserPreferences;
  errors: string[];
} {
  const normalized = PreferenceValidator.normalize(prefs);
  const errors = PreferenceValidator.validate(normalized);
  
  return {
    isValid: errors.length === 0,
    normalized,
    errors
  };
}

export { UserPreferences, validateUserPreferences };