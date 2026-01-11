typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en-US',
    fontSize: 14
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 32;

class UserPreferencesManager {
    private preferences: UserPreferences;

    constructor() {
        this.preferences = this.loadPreferences();
    }

    private loadPreferences(): UserPreferences {
        const stored = localStorage.getItem('userPreferences');
        if (!stored) return {...DEFAULT_PREFERENCES};

        try {
            const parsed = JSON.parse(stored);
            return this.validatePreferences(parsed);
        } catch {
            return {...DEFAULT_PREFERENCES};
        }
    }

    private validatePreferences(data: any): UserPreferences {
        const prefs: UserPreferences = {...DEFAULT_PREFERENCES};

        if (typeof data.theme === 'string' && ['light', 'dark', 'auto'].includes(data.theme)) {
            prefs.theme = data.theme;
        }

        if (typeof data.notifications === 'boolean') {
            prefs.notifications = data.notifications;
        }

        if (typeof data.language === 'string' && VALID_LANGUAGES.includes(data.language)) {
            prefs.language = data.language;
        }

        if (typeof data.fontSize === 'number') {
            prefs.fontSize = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, data.fontSize));
        }

        return prefs;
    }

    getPreferences(): Readonly<UserPreferences> {
        return {...this.preferences};
    }

    updatePreferences(updates: Partial<UserPreferences>): boolean {
        const newPreferences = {...this.preferences, ...updates};
        const validated = this.validatePreferences(newPreferences);

        if (JSON.stringify(this.preferences) !== JSON.stringify(validated)) {
            this.preferences = validated;
            this.savePreferences();
            return true;
        }
        return false;
    }

    private savePreferences(): void {
        localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
    }

    resetToDefaults(): void {
        this.preferences = {...DEFAULT_PREFERENCES};
        this.savePreferences();
    }

    isDarkMode(): boolean {
        if (this.preferences.theme === 'auto') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return this.preferences.theme === 'dark';
    }
}

export const preferencesManager = new UserPreferencesManager();
```