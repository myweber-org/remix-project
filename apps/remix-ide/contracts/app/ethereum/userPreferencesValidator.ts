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
            if (!['light', 'dark', 'auto'].includes(value)) {
                return `Theme must be one of: light, dark, auto`;
            }
            return null;
        },
        fontSize: (value) => {
            if (typeof value !== 'number') {
                return 'Font size must be a number';
            }
            if (value < 8 || value > 72) {
                return 'Font size must be between 8 and 72';
            }
            return null;
        },
        language: (value) => {
            if (typeof value !== 'string' || value.trim().length === 0) {
                return 'Language must be a non-empty string';
            }
            if (value.length > 10) {
                return 'Language code cannot exceed 10 characters';
            }
            return null;
        }
    };

    static validate(preferences: Partial<UserPreferences>): string[] {
        const errors: string[] = [];

        for (const [key, value] of Object.entries(preferences)) {
            const rule = this.DEFAULT_RULES[key as keyof UserPreferences];
            if (rule && value !== undefined) {
                const error = rule(value as any);
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
            if (!(key in preferences)) {
                errors.push(`${key}: is required`);
            }
        }

        return errors;
    }
}

export { UserPreferences, PreferenceValidator };
```