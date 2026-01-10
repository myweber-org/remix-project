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

    public updatePreferences(updates: Partial<UserPreferences>): void {
        const validatedUpdates = this.validateUpdates(updates);
        this.preferences = { ...this.preferences, ...validatedUpdates };
        this.savePreferences();
    }

    public getPreferences(): Readonly<UserPreferences> {
        return { ...this.preferences };
    }

    public resetToDefaults(): void {
        this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
        this.savePreferences();
    }

    private validateUpdates(updates: Partial<UserPreferences>): Partial<UserPreferences> {
        const validated: Partial<UserPreferences> = {};

        if (updates.theme !== undefined) {
            if (['light', 'dark', 'auto'].includes(updates.theme)) {
                validated.theme = updates.theme;
            }
        }

        if (updates.fontSize !== undefined) {
            validated.fontSize = Math.max(8, Math.min(72, updates.fontSize));
        }

        if (updates.autoSaveInterval !== undefined) {
            validated.autoSaveInterval = Math.max(1000, Math.min(300000, updates.autoSaveInterval));
        }

        if (updates.language !== undefined && updates.language.trim().length > 0) {
            validated.language = updates.language.trim();
        }

        if (updates.notificationsEnabled !== undefined) {
            validated.notificationsEnabled = Boolean(updates.notificationsEnabled);
        }

        return validated;
    }

    private loadPreferences(): UserPreferences {
        try {
            const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return { ...UserPreferencesManager.DEFAULT_PREFERENCES, ...parsed };
            }
        } catch (error) {
            console.warn('Failed to load preferences from storage:', error);
        }
        return { ...UserPreferencesManager.DEFAULT_PREFERENCES };
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
}

export { UserPreferencesManager, type UserPreferences };
```