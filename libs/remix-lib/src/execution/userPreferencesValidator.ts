typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    timezone: string;
}

class PreferenceValidator {
    private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
    private static readonly VALID_TIMEZONES = /^[A-Za-z_]+\/[A-Za-z_]+$/;

    static validate(prefs: UserPreferences): string[] {
        const errors: string[] = [];

        if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
            errors.push(`Invalid theme value: ${prefs.theme}. Must be 'light', 'dark', or 'auto'.`);
        }

        if (typeof prefs.notifications !== 'boolean') {
            errors.push('Notifications must be a boolean value.');
        }

        if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
            errors.push(`Unsupported language: ${prefs.language}. Supported languages are: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
        }

        if (!PreferenceValidator.VALID_TIMEZONES.test(prefs.timezone)) {
            errors.push(`Invalid timezone format: ${prefs.timezone}. Must be in format 'Area/Location'.`);
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
    const testPreferences: UserPreferences = {
        theme: 'blue' as any,
        notifications: 'yes' as any,
        language: 'zh',
        timezone: 'Invalid/Zone/Format'
    };

    try {
        console.log('Testing invalid preferences:');
        const errors = PreferenceValidator.validate(testPreferences);
        errors.forEach(error => console.log(`- ${error}`));
        
        console.log('\nAttempting to validate and throw:');
        PreferenceValidator.validateAndThrow(testPreferences);
    } catch (error) {
        console.error('Caught error:', error.message);
    }

    const validPreferences: UserPreferences = {
        theme: 'dark',
        notifications: true,
        language: 'en',
        timezone: 'America/New_York'
    };

    console.log('\nTesting valid preferences:');
    const validErrors = PreferenceValidator.validate(validPreferences);
    console.log(`Validation errors: ${validErrors.length}`);
}

if (require.main === module) {
    testValidation();
}
```