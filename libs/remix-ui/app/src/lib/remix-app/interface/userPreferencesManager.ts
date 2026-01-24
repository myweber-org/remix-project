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

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 32;

class UserPreferencesManager {
    private preferences: UserPreferences;

    constructor(initialPreferences?: Partial<UserPreferences>) {
        this.preferences = { ...DEFAULT_PREFERENCES, ...initialPreferences };
        this.validateAndSanitize();
    }

    private validateAndSanitize(): void {
        if (!['light', 'dark', 'auto'].includes(this.preferences.theme)) {
            this.preferences.theme = DEFAULT_PREFERENCES.theme;
        }

        if (!VALID_LANGUAGES.includes(this.preferences.language)) {
            this.preferences.language = DEFAULT_PREFERENCES.language;
        }

        if (typeof this.preferences.fontSize !== 'number' || 
            this.preferences.fontSize < MIN_FONT_SIZE || 
            this.preferences.fontSize > MAX_FONT_SIZE) {
            this.preferences.fontSize = DEFAULT_PREFERENCES.fontSize;
        }

        this.preferences.notifications = Boolean(this.preferences.notifications);
        this.preferences.autoSave = Boolean(this.preferences.autoSave);
    }

    updatePreferences(updates: Partial<UserPreferences>): void {
        this.preferences = { ...this.preferences, ...updates };
        this.validateAndSanitize();
    }

    getPreferences(): Readonly<UserPreferences> {
        return { ...this.preferences };
    }

    resetToDefaults(): void {
        this.preferences = { ...DEFAULT_PREFERENCES };
    }

    exportPreferences(): string {
        return JSON.stringify(this.preferences, null, 2);
    }

    static importPreferences(jsonString: string): UserPreferencesManager {
        try {
            const parsed = JSON.parse(jsonString);
            return new UserPreferencesManager(parsed);
        } catch {
            return new UserPreferencesManager();
        }
    }
}

function createPreferencesManager(): UserPreferencesManager {
    const stored = localStorage.getItem('userPreferences');
    if (stored) {
        return UserPreferencesManager.importPreferences(stored);
    }
    return new UserPreferencesManager();
}

export { UserPreferencesManager, createPreferencesManager, type UserPreferences };
```