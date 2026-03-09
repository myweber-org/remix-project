typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    fontSize: number;
    autoSave: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en-US',
    fontSize: 14,
    autoSave: true
};

class PreferencesValidator {
    private static readonly THEME_VALUES = ['light', 'dark', 'auto'] as const;
    private static readonly MIN_FONT_SIZE = 8;
    private static readonly MAX_FONT_SIZE = 72;
    private static readonly SUPPORTED_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];

    static validate(preferences: Partial<UserPreferences>): UserPreferences {
        const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

        if (preferences.theme !== undefined) {
            if (this.THEME_VALUES.includes(preferences.theme as any)) {
                validated.theme = preferences.theme as UserPreferences['theme'];
            }
        }

        if (preferences.notifications !== undefined) {
            validated.notifications = Boolean(preferences.notifications);
        }

        if (preferences.language !== undefined) {
            if (this.SUPPORTED_LANGUAGES.includes(preferences.language)) {
                validated.language = preferences.language;
            }
        }

        if (preferences.fontSize !== undefined) {
            const size = Number(preferences.fontSize);
            if (!isNaN(size) && size >= this.MIN_FONT_SIZE && size <= this.MAX_FONT_SIZE) {
                validated.fontSize = Math.round(size);
            }
        }

        if (preferences.autoSave !== undefined) {
            validated.autoSave = Boolean(preferences.autoSave);
        }

        return validated;
    }

    static sanitizeInput(input: unknown): Partial<UserPreferences> {
        if (typeof input !== 'object' || input === null) {
            return {};
        }

        const sanitized: Partial<UserPreferences> = {};
        const raw = input as Record<string, unknown>;

        if (raw.theme && typeof raw.theme === 'string') {
            sanitized.theme = raw.theme as UserPreferences['theme'];
        }

        if (raw.notifications !== undefined) {
            sanitized.notifications = Boolean(raw.notifications);
        }

        if (raw.language && typeof raw.language === 'string') {
            sanitized.language = raw.language;
        }

        if (raw.fontSize !== undefined) {
            sanitized.fontSize = Number(raw.fontSize);
        }

        if (raw.autoSave !== undefined) {
            sanitized.autoSave = Boolean(raw.autoSave);
        }

        return sanitized;
    }
}

export { UserPreferences, PreferencesValidator, DEFAULT_PREFERENCES };
```