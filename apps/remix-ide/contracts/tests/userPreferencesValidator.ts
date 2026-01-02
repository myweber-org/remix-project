interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
  itemsPerPage: number;
}

type ValidationRule<T> = {
  validate: (value: T) => boolean;
  errorMessage: string;
};

type UserPreferencesValidationRules = {
  [K in keyof UserPreferences]?: ValidationRule<UserPreferences[K]>[];
};

class UserPreferencesValidator {
  private readonly rules: UserPreferencesValidationRules = {
    theme: [
      {
        validate: (value) => ['light', 'dark', 'auto'].includes(value),
        errorMessage: 'Theme must be one of: light, dark, auto'
      }
    ],
    notifications: [
      {
        validate: (value) => typeof value === 'boolean',
        errorMessage: 'Notifications must be a boolean value'
      }
    ],
    language: [
      {
        validate: (value) => value.length >= 2 && value.length <= 10,
        errorMessage: 'Language code must be between 2 and 10 characters'
      },
      {
        validate: (value) => /^[a-z-]+$/.test(value),
        errorMessage: 'Language code can only contain lowercase letters and hyphens'
      }
    ],
    timezone: [
      {
        validate: (value) => /^[A-Za-z_]+\/[A-Za-z_]+$/.test(value),
        errorMessage: 'Timezone must be in format Area/Location'
      }
    ],
    itemsPerPage: [
      {
        validate: (value) => Number.isInteger(value) && value >= 5 && value <= 100,
        errorMessage: 'Items per page must be an integer between 5 and 100'
      }
    ]
  };

  validate(preferences: Partial<UserPreferences>): { isValid: boolean; errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};

    for (const [key, value] of Object.entries(preferences)) {
      const fieldRules = this.rules[key as keyof UserPreferences];
      
      if (fieldRules && value !== undefined) {
        const fieldErrors: string[] = [];
        
        for (const rule of fieldRules) {
          if (!rule.validate(value as any)) {
            fieldErrors.push(rule.errorMessage);
          }
        }
        
        if (fieldErrors.length > 0) {
          errors[key] = fieldErrors;
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  validateStrict(preferences: UserPreferences): { isValid: boolean; errors: Record<string, string[]> } {
    const missingFields: string[] = [];
    
    for (const key of Object.keys(this.rules)) {
      if (preferences[key as keyof UserPreferences] === undefined) {
        missingFields.push(key);
      }
    }

    if (missingFields.length > 0) {
      return {
        isValid: false,
        errors: {
          _missing: [`Missing required fields: ${missingFields.join(', ')}`]
        }
      };
    }

    return this.validate(preferences);
  }
}

function createDefaultPreferences(): UserPreferences {
  return {
    theme: 'auto',
    notifications: true,
    language: 'en',
    timezone: 'UTC',
    itemsPerPage: 20
  };
}

export { UserPreferencesValidator, createDefaultPreferences };
export type { UserPreferences };