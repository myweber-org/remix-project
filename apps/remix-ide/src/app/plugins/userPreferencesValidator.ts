interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
  twoFactorAuth: boolean;
}

type ValidationRule<T> = {
  [K in keyof T]?: (value: T[K]) => boolean | string;
};

class PreferenceValidator {
  private static defaultRules: ValidationRule<UserPreferences> = {
    theme: (value) => ['light', 'dark', 'auto'].includes(value),
    fontSize: (value) => value >= 12 && value <= 24,
    language: (value) => /^[a-z]{2}(-[A-Z]{2})?$/.test(value),
  };

  static validate(
    preferences: Partial<UserPreferences>,
    customRules?: ValidationRule<UserPreferences>
  ): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};
    const rules = { ...this.defaultRules, ...customRules };

    for (const [key, rule] of Object.entries(rules)) {
      const value = preferences[key as keyof UserPreferences];
      if (value !== undefined && rule) {
        const result = rule(value);
        if (result !== true) {
          errors[key] = typeof result === 'string' ? result : `Invalid value for ${key}`;
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static createCustomRule<T extends keyof UserPreferences>(
    key: T,
    validator: (value: UserPreferences[T]) => boolean | string
  ): ValidationRule<UserPreferences> {
    return { [key]: validator } as ValidationRule<UserPreferences>;
  }
}

export { UserPreferences, PreferenceValidator };