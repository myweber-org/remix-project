interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
  itemsPerPage: number;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly VALID_TIMEZONES = /^[A-Za-z_]+\/[A-Za-z_]+$/;

  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = {
      theme: 'auto',
      notifications: true,
      language: 'en',
      timezone: 'UTC',
      itemsPerPage: 10,
      ...preferences
    };

    if (!['light', 'dark', 'auto'].includes(validated.theme)) {
      throw new PreferenceValidationError(`Invalid theme: ${validated.theme}`);
    }

    if (typeof validated.notifications !== 'boolean') {
      throw new PreferenceValidationError('Notifications must be a boolean');
    }

    if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(validated.language)) {
      throw new PreferenceValidationError(`Unsupported language: ${validated.language}`);
    }

    if (!UserPreferencesValidator.VALID_TIMEZONES.test(validated.timezone)) {
      throw new PreferenceValidationError(`Invalid timezone format: ${validated.timezone}`);
    }

    if (!Number.isInteger(validated.itemsPerPage) || validated.itemsPerPage < 1 || validated.itemsPerPage > 100) {
      throw new PreferenceValidationError('Items per page must be an integer between 1 and 100');
    }

    return validated;
  }

  static validatePartialUpdate(updates: Partial<UserPreferences>): Partial<UserPreferences> {
    const result: Partial<UserPreferences> = {};

    if (updates.theme !== undefined) {
      if (!['light', 'dark', 'auto'].includes(updates.theme)) {
        throw new PreferenceValidationError(`Invalid theme: ${updates.theme}`);
      }
      result.theme = updates.theme;
    }

    if (updates.notifications !== undefined) {
      if (typeof updates.notifications !== 'boolean') {
        throw new PreferenceValidationError('Notifications must be a boolean');
      }
      result.notifications = updates.notifications;
    }

    if (updates.language !== undefined) {
      if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(updates.language)) {
        throw new PreferenceValidationError(`Unsupported language: ${updates.language}`);
      }
      result.language = updates.language;
    }

    if (updates.timezone !== undefined) {
      if (!UserPreferencesValidator.VALID_TIMEZONES.test(updates.timezone)) {
        throw new PreferenceValidationError(`Invalid timezone format: ${updates.timezone}`);
      }
      result.timezone = updates.timezone;
    }

    if (updates.itemsPerPage !== undefined) {
      if (!Number.isInteger(updates.itemsPerPage) || updates.itemsPerPage < 1 || updates.itemsPerPage > 100) {
        throw new PreferenceValidationError('Items per page must be an integer between 1 and 100');
      }
      result.itemsPerPage = updates.itemsPerPage;
    }

    return result;
  }
}

export { UserPreferences, UserPreferencesValidator, PreferenceValidationError };