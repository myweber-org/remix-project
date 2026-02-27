interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  resultsPerPage: number;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

const validateUserPreferences = (prefs: UserPreferences): void => {
  const validThemes = ['light', 'dark', 'auto'];
  const validLanguages = ['en', 'es', 'fr', 'de'];
  const maxResultsPerPage = 100;

  if (!validThemes.includes(prefs.theme)) {
    throw new PreferenceValidationError(
      `Invalid theme: ${prefs.theme}. Must be one of: ${validThemes.join(', ')}`
    );
  }

  if (typeof prefs.notifications !== 'boolean') {
    throw new PreferenceValidationError('Notifications must be a boolean value');
  }

  if (!validLanguages.includes(prefs.language)) {
    throw new PreferenceValidationError(
      `Unsupported language: ${prefs.language}. Supported languages: ${validLanguages.join(', ')}`
    );
  }

  if (prefs.resultsPerPage < 1 || prefs.resultsPerPage > maxResultsPerPage) {
    throw new PreferenceValidationError(
      `Results per page must be between 1 and ${maxResultsPerPage}`
    );
  }

  if (!Number.isInteger(prefs.resultsPerPage)) {
    throw new PreferenceValidationError('Results per page must be an integer');
  }
};

const exampleUsage = () => {
  const validPreferences: UserPreferences = {
    theme: 'dark',
    notifications: true,
    language: 'en',
    resultsPerPage: 25
  };

  const invalidPreferences: UserPreferences = {
    theme: 'purple',
    notifications: 'yes',
    language: 'zh',
    resultsPerPage: 150
  };

  try {
    validateUserPreferences(validPreferences);
    console.log('Valid preferences accepted');
  } catch (error) {
    if (error instanceof PreferenceValidationError) {
      console.error('Validation failed:', error.message);
    }
  }

  try {
    validateUserPreferences(invalidPreferences);
  } catch (error) {
    if (error instanceof PreferenceValidationError) {
      console.error('Invalid preferences rejected:', error.message);
    }
  }
};

export { UserPreferences, PreferenceValidationError, validateUserPreferences };