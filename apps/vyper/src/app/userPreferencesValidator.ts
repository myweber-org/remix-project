typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    fontSize: number;
}

class PreferenceValidator {
    private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
    private static readonly MIN_FONT_SIZE = 8;
    private static readonly MAX_FONT_SIZE = 72;

    static validate(prefs: Partial<UserPreferences>): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (prefs.theme !== undefined && !['light', 'dark', 'auto'].includes(prefs.theme)) {
            errors.push(`Invalid theme: ${prefs.theme}`);
        }

        if (prefs.language !== undefined && !this.SUPPORTED_LANGUAGES.includes(prefs.language)) {
            errors.push(`Unsupported language: ${prefs.language}`);
        }

        if (prefs.fontSize !== undefined) {
            if (typeof prefs.fontSize !== 'number' || isNaN(prefs.fontSize)) {
                errors.push('Font size must be a number');
            } else if (prefs.fontSize < this.MIN_FONT_SIZE || prefs.fontSize > this.MAX_FONT_SIZE) {
                errors.push(`Font size must be between ${this.MIN_FONT_SIZE} and ${this.MAX_FONT_SIZE}`);
            }
        }

        if (prefs.notifications !== undefined && typeof prefs.notifications !== 'boolean') {
            errors.push('Notifications must be a boolean value');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    static normalize(prefs: Partial<UserPreferences>): UserPreferences {
        return {
            theme: prefs.theme || 'auto',
            notifications: prefs.notifications ?? true,
            language: prefs.language || 'en',
            fontSize: prefs.fontSize || 16
        };
    }
}

export { UserPreferences, PreferenceValidator };
```