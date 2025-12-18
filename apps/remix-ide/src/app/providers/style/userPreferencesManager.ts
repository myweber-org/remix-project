typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notificationsEnabled: boolean;
    fontSize: number;
    autoSaveInterval: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    language: 'en-US',
    notificationsEnabled: true,
    fontSize: 14,
    autoSaveInterval: 30000
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 32;
const MIN_AUTO_SAVE_INTERVAL = 5000;
const MAX_AUTO_SAVE_INTERVAL = 300000;

class UserPreferencesManager {
    private preferences: UserPreferences;
    private readonly storageKey = 'user_preferences';

    constructor() {
        this.preferences = this.loadPreferences();
    }

    private loadPreferences(): UserPreferences {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                return this.validateAndMerge(parsed);
            }
        } catch (error) {
            console.warn('Failed to load preferences from storage:', error);
        }
        return { ...DEFAULT_PREFERENCES };
    }

    private validateAndMerge(partialPrefs: Partial<UserPreferences>): UserPreferences {
        const merged = { ...DEFAULT_PREFERENCES, ...partialPrefs };

        if (!['light', 'dark', 'auto'].includes(merged.theme)) {
            merged.theme = DEFAULT_PREFERENCES.theme;
        }

        if (!VALID_LANGUAGES.includes(merged.language)) {
            merged.language = DEFAULT_PREFERENCES.language;
        }

        if (typeof merged.notificationsEnabled !== 'boolean') {
            merged.notificationsEnabled = DEFAULT_PREFERENCES.notificationsEnabled;
        }

        if (typeof merged.fontSize !== 'number' || 
            merged.fontSize < MIN_FONT_SIZE || 
            merged.fontSize > MAX_FONT_SIZE) {
            merged.fontSize = DEFAULT_PREFERENCES.fontSize;
        }

        if (typeof merged.autoSaveInterval !== 'number' ||
            merged.autoSaveInterval < MIN_AUTO_SAVE_INTERVAL ||
            merged.autoSaveInterval > MAX_AUTO_SAVE_INTERVAL) {
            merged.autoSaveInterval = DEFAULT_PREFERENCES.autoSaveInterval;
        }

        return merged;
    }

    updatePreferences(updates: Partial<UserPreferences>): boolean {
        try {
            const newPreferences = this.validateAndMerge({
                ...this.preferences,
                ...updates
            });
            
            this.preferences = newPreferences;
            localStorage.setItem(this.storageKey, JSON.stringify(newPreferences));
            return true;
        } catch (error) {
            console.error('Failed to update preferences:', error);
            return false;
        }
    }

    getPreferences(): Readonly<UserPreferences> {
        return { ...this.preferences };
    }

    resetToDefaults(): void {
        this.preferences = { ...DEFAULT_PREFERENCES };
        localStorage.removeItem(this.storageKey);
    }

    exportPreferences(): string {
        return JSON.stringify(this.preferences, null, 2);
    }

    importPreferences(jsonString: string): boolean {
        try {
            const imported = JSON.parse(jsonString);
            return this.updatePreferences(imported);
        } catch (error) {
            console.error('Failed to import preferences:', error);
            return false;
        }
    }
}

export { UserPreferencesManager, type UserPreferences };
```