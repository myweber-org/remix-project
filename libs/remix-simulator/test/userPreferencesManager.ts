typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notificationsEnabled: boolean;
    fontSize: number;
    autoSaveInterval: number;
}

class UserPreferencesManager {
    private static readonly STORAGE_KEY = 'user_preferences';
    private static readonly DEFAULT_PREFERENCES: UserPreferences = {
        theme: 'auto',
        language: 'en-US',
        notificationsEnabled: true,
        fontSize: 14,
        autoSaveInterval: 30000
    };

    private preferences: UserPreferences;

    constructor() {
        this.preferences = this.loadPreferences();
    }

    private loadPreferences(): UserPreferences {
        try {
            const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
            if (!stored) return { ...UserPreferencesManager.DEFAULT_PREFERENCES };

            const parsed = JSON.parse(stored);
            return this.validateAndMerge(parsed);
        } catch {
            return { ...UserPreferencesManager.DEFAULT_PREFERENCES };
        }
    }

    private validateAndMerge(partial: Partial<UserPreferences>): UserPreferences {
        const validated: UserPreferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };

        if (partial.theme && ['light', 'dark', 'auto'].includes(partial.theme)) {
            validated.theme = partial.theme;
        }

        if (typeof partial.language === 'string' && partial.language.length >= 2) {
            validated.language = partial.language;
        }

        if (typeof partial.notificationsEnabled === 'boolean') {
            validated.notificationsEnabled = partial.notificationsEnabled;
        }

        if (typeof partial.fontSize === 'number' && partial.fontSize >= 8 && partial.fontSize <= 72) {
            validated.fontSize = partial.fontSize;
        }

        if (typeof partial.autoSaveInterval === 'number' && partial.autoSaveInterval >= 1000) {
            validated.autoSaveInterval = partial.autoSaveInterval;
        }

        return validated;
    }

    getPreferences(): Readonly<UserPreferences> {
        return { ...this.preferences };
    }

    updatePreferences(updates: Partial<UserPreferences>): boolean {
        const newPreferences = this.validateAndMerge({
            ...this.preferences,
            ...updates
        });

        if (JSON.stringify(this.preferences) === JSON.stringify(newPreferences)) {
            return false;
        }

        this.preferences = newPreferences;
        this.savePreferences();
        return true;
    }

    private savePreferences(): void {
        try {
            localStorage.setItem(
                UserPreferencesManager.STORAGE_KEY,
                JSON.stringify(this.preferences)
            );
        } catch (error) {
            console.error('Failed to save preferences:', error);
        }
    }

    resetToDefaults(): void {
        this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
        this.savePreferences();
    }

    exportPreferences(): string {
        return JSON.stringify(this.preferences, null, 2);
    }

    importPreferences(jsonString: string): boolean {
        try {
            const parsed = JSON.parse(jsonString);
            return this.updatePreferences(parsed);
        } catch {
            return false;
        }
    }
}

export { UserPreferencesManager, type UserPreferences };
```