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
    language: 'en',
    fontSize: 14,
    autoSave: true
};

const VALID_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 32;

class UserPreferencesManager {
    private preferences: UserPreferences;

    constructor(initialPreferences?: Partial<UserPreferences>) {
        this.preferences = { ...DEFAULT_PREFERENCES, ...initialPreferences };
        this.validateAndFixPreferences();
    }

    private validateAndFixPreferences(): void {
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

        if (typeof this.preferences.notifications !== 'boolean') {
            this.preferences.notifications = DEFAULT_PREFERENCES.notifications;
        }

        if (typeof this.preferences.autoSave !== 'boolean') {
            this.preferences.autoSave = DEFAULT_PREFERENCES.autoSave;
        }
    }

    getPreferences(): UserPreferences {
        return { ...this.preferences };
    }

    updatePreferences(updates: Partial<UserPreferences>): void {
        this.preferences = { ...this.preferences, ...updates };
        this.validateAndFixPreferences();
    }

    resetToDefaults(): void {
        this.preferences = { ...DEFAULT_PREFERENCES };
    }

    exportPreferences(): string {
        return JSON.stringify(this.preferences);
    }

    importPreferences(jsonString: string): boolean {
        try {
            const parsed = JSON.parse(jsonString);
            this.updatePreferences(parsed);
            return true;
        } catch {
            return false;
        }
    }

    isDarkModeEnabled(): boolean {
        if (this.preferences.theme === 'auto') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return this.preferences.theme === 'dark';
    }
}

export { UserPreferencesManager, type UserPreferences };
```