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