
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

class PreferenceValidationError extends Error {
  constructor(message: string, public field: keyof UserPreferences) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

export function validateUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const defaults: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    itemsPerPage: 20
  };

  const validated: UserPreferences = { ...defaults, ...prefs };

  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    throw new PreferenceValidationError('Theme must be light, dark, or auto', 'theme');
  }

  if (typeof validated.notifications !== 'boolean') {
    throw new PreferenceValidationError('Notifications must be a boolean', 'notifications');
  }

  if (!validated.language || validated.language.trim().length === 0) {
    throw new PreferenceValidationError('Language cannot be empty', 'language');
  }

  if (!Number.isInteger(validated.itemsPerPage) || validated.itemsPerPage < 1 || validated.itemsPerPage > 100) {
    throw new PreferenceValidationError('Items per page must be between 1 and 100', 'itemsPerPage');
  }

  return validated;
}

export function createPreferencesStore() {
  let currentPreferences: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    itemsPerPage: 20
  };

  return {
    getPreferences: (): UserPreferences => ({ ...currentPreferences }),
    
    updatePreferences: (updates: Partial<UserPreferences>): UserPreferences => {
      const newPreferences = validateUserPreferences({ ...currentPreferences, ...updates });
      currentPreferences = newPreferences;
      return { ...newPreferences };
    },
    
    resetToDefaults: (): UserPreferences => {
      currentPreferences = validateUserPreferences({});
      return { ...currentPreferences };
    }
  };
}