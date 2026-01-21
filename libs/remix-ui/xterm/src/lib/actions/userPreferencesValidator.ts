typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    fontSize: number;
}

class PreferenceValidator {
    private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
    private static readonly MIN_FONT_SIZE = 8;
    private static readonly MAX_FONT_SIZE = 72;

    static validate(prefs: Partial<UserPreferences>): string[] {
        const errors: string[] = [];

        if (prefs.theme !== undefined) {
            if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
                errors.push(`Invalid theme: ${prefs.theme}. Must be 'light', 'dark', or 'auto'.`);
            }
        }

        if (prefs.language !== undefined) {
            if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
                errors.push(`Unsupported language: ${prefs.language}. Supported: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
            }
        }

        if (prefs.fontSize !== undefined) {
            if (typeof prefs.fontSize !== 'number' || isNaN(prefs.fontSize)) {
                errors.push('Font size must be a valid number.');
            } else if (prefs.fontSize < PreferenceValidator.MIN_FONT_SIZE || prefs.fontSize > PreferenceValidator.MAX_FONT_SIZE) {
                errors.push(`Font size must be between ${PreferenceValidator.MIN_FONT_SIZE} and ${PreferenceValidator.MAX_FONT_SIZE}.`);
            }
        }

        if (prefs.notifications !== undefined && typeof prefs.notifications !== 'boolean') {
            errors.push('Notifications preference must be a boolean value.');
        }

        return errors;
    }

    static validateAndThrow(prefs: Partial<UserPreferences>): void {
        const errors = this.validate(prefs);
        if (errors.length > 0) {
            throw new Error(`Validation failed:\n${errors.join('\n')}`);
        }
    }
}

function updateUserPreferences(newPrefs: Partial<UserPreferences>): void {
    try {
        PreferenceValidator.validateAndThrow(newPrefs);
        console.log('Preferences updated successfully:', newPrefs);
    } catch (error) {
        console.error('Failed to update preferences:', error.message);
    }
}

// Example usage
const validPrefs = { theme: 'dark', fontSize: 14, language: 'en' };
const invalidPrefs = { theme: 'purple', fontSize: 200, language: 'xx' };

updateUserPreferences(validPrefs);
updateUserPreferences(invalidPrefs);
```