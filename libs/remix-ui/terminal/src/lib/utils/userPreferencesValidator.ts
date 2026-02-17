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

    static validate(prefs: UserPreferences): string[] {
        const errors: string[] = [];

        if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
            errors.push(`Invalid theme: ${prefs.theme}. Must be 'light', 'dark', or 'auto'.`);
        }

        if (typeof prefs.notifications !== 'boolean') {
            errors.push('Notifications must be a boolean value.');
        }

        if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
            errors.push(`Unsupported language: ${prefs.language}. Supported: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
        }

        if (prefs.fontSize < PreferenceValidator.MIN_FONT_SIZE || prefs.fontSize > PreferenceValidator.MAX_FONT_SIZE) {
            errors.push(`Font size ${prefs.fontSize} is out of range. Must be between ${PreferenceValidator.MIN_FONT_SIZE} and ${PreferenceValidator.MAX_FONT_SIZE}.`);
        }

        if (!Number.isInteger(prefs.fontSize)) {
            errors.push('Font size must be an integer.');
        }

        return errors;
    }

    static validateAndThrow(prefs: UserPreferences): void {
        const errors = this.validate(prefs);
        if (errors.length > 0) {
            throw new Error(`Validation failed:\n${errors.join('\n')}`);
        }
    }
}

function testValidation() {
    const testPreferences: UserPreferences[] = [
        { theme: 'light', notifications: true, language: 'en', fontSize: 14 },
        { theme: 'purple', notifications: 'yes', language: 'xx', fontSize: 100 },
        { theme: 'dark', notifications: false, language: 'fr', fontSize: 12.5 }
    ];

    testPreferences.forEach((prefs, index) => {
        console.log(`Test ${index + 1}:`);
        try {
            const errors = PreferenceValidator.validate(prefs);
            if (errors.length === 0) {
                console.log('  ✓ Valid preferences');
            } else {
                console.log('  ✗ Validation errors:', errors);
            }
            PreferenceValidator.validateAndThrow(prefs);
        } catch (error) {
            console.log('  ✗ Exception:', error.message);
        }
    });
}

export { UserPreferences, PreferenceValidator, testValidation };
```