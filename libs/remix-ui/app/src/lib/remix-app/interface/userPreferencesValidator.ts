typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    fontSize: number;
    autoSave: boolean;
}

type ValidationRule<T> = {
    [K in keyof T]?: (value: T[K]) => string | null;
};

class PreferenceValidator {
    private static readonly DEFAULT_RULES: ValidationRule<UserPreferences> = {
        theme: (value) => {
            const validThemes = ['light', 'dark', 'auto'];
            return validThemes.includes(value) ? null : `Theme must be one of: ${validThemes.join(', ')}`;
        },
        fontSize: (value) => {
            return value >= 8 && value <= 72 ? null : 'Font size must be between 8 and 72';
        },
        language: (value) => {
            return value.length >= 2 && value.length <= 10 ? null : 'Language code must be 2-10 characters';
        }
    };

    static validate(preferences: Partial<UserPreferences>, customRules?: ValidationRule<UserPreferences>): string[] {
        const errors: string[] = [];
        const rules = { ...this.DEFAULT_RULES, ...customRules };

        for (const [key, rule] of Object.entries(rules)) {
            const preferenceKey = key as keyof UserPreferences;
            const value = preferences[preferenceKey];
            
            if (value !== undefined && rule) {
                const error = rule(value);
                if (error) {
                    errors.push(`${key}: ${error}`);
                }
            }
        }

        return errors;
    }

    static validateStrict(preferences: UserPreferences): string[] {
        const errors = this.validate(preferences);
        
        const requiredKeys: (keyof UserPreferences)[] = ['theme', 'language', 'fontSize'];
        for (const key of requiredKeys) {
            if (preferences[key] === undefined) {
                errors.push(`${key}: Required field is missing`);
            }
        }

        return errors;
    }
}

export { UserPreferences, PreferenceValidator };
```
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'PreferenceError';
  }
}

class UserPreferencesValidator {
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];

  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 16,
      ...preferences
    };

    if (!['light', 'dark', 'auto'].includes(validated.theme)) {
      throw new PreferenceError(
        `Theme must be one of: light, dark, auto. Received: ${validated.theme}`,
        'theme'
      );
    }

    if (typeof validated.notifications !== 'boolean') {
      throw new PreferenceError(
        `Notifications must be a boolean. Received: ${validated.notifications}`,
        'notifications'
      );
    }

    if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(validated.language)) {
      throw new PreferenceError(
        `Language must be one of: ${UserPreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}. Received: ${validated.language}`,
        'language'
      );
    }

    if (validated.fontSize < UserPreferencesValidator.MIN_FONT_SIZE || 
        validated.fontSize > UserPreferencesValidator.MAX_FONT_SIZE) {
      throw new PreferenceError(
        `Font size must be between ${UserPreferencesValidator.MIN_FONT_SIZE} and ${UserPreferencesValidator.MAX_FONT_SIZE}. Received: ${validated.fontSize}`,
        'fontSize'
      );
    }

    return validated;
  }

  static validateBatch(preferencesArray: Partial<UserPreferences>[]): UserPreferences[] {
    const results: UserPreferences[] = [];
    const errors: PreferenceError[] = [];

    preferencesArray.forEach((prefs, index) => {
      try {
        results.push(this.validate(prefs));
      } catch (error) {
        if (error instanceof PreferenceError) {
          errors.push(error);
        } else {
          throw error;
        }
      }
    });

    if (errors.length > 0) {
      const errorMessages = errors.map(err => `[${err.field}] ${err.message}`).join('; ');
      throw new PreferenceError(
        `Batch validation failed with ${errors.length} error(s): ${errorMessages}`,
        'batch'
      );
    }

    return results;
  }
}

export { UserPreferencesValidator, PreferenceError, UserPreferences };