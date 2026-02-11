typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: boolean;
    fontSize: number;
    autoSave: boolean;
}

class UserPreferencesManager {
    private static readonly STORAGE_KEY = 'user_preferences';
    private static readonly DEFAULT_PREFERENCES: UserPreferences = {
        theme: 'auto',
        language: 'en-US',
        notifications: true,
        fontSize: 14,
        autoSave: true
    };

    private preferences: UserPreferences;

    constructor() {
        this.preferences = this.loadPreferences();
    }

    private loadPreferences(): UserPreferences {
        try {
            const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return this.validatePreferences(parsed);
            }
        } catch (error) {
            console.warn('Failed to load preferences from storage:', error);
        }
        return { ...UserPreferencesManager.DEFAULT_PREFERENCES };
    }

    private validatePreferences(data: unknown): UserPreferences {
        const defaultPrefs = UserPreferencesManager.DEFAULT_PREFERENCES;
        
        if (!data || typeof data !== 'object') {
            return { ...defaultPrefs };
        }

        const prefs = data as Partial<UserPreferences>;
        
        return {
            theme: this.isValidTheme(prefs.theme) ? prefs.theme : defaultPrefs.theme,
            language: typeof prefs.language === 'string' ? prefs.language : defaultPrefs.language,
            notifications: typeof prefs.notifications === 'boolean' ? prefs.notifications : defaultPrefs.notifications,
            fontSize: typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 32 
                ? prefs.fontSize 
                : defaultPrefs.fontSize,
            autoSave: typeof prefs.autoSave === 'boolean' ? prefs.autoSave : defaultPrefs.autoSave
        };
    }

    private isValidTheme(theme: unknown): theme is UserPreferences['theme'] {
        return theme === 'light' || theme === 'dark' || theme === 'auto';
    }

    savePreferences(): void {
        try {
            localStorage.setItem(
                UserPreferencesManager.STORAGE_KEY, 
                JSON.stringify(this.preferences)
            );
        } catch (error) {
            console.error('Failed to save preferences:', error);
        }
    }

    updatePreferences(updates: Partial<UserPreferences>): void {
        this.preferences = {
            ...this.preferences,
            ...updates
        };
        this.savePreferences();
    }

    resetToDefaults(): void {
        this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
        this.savePreferences();
    }

    getPreferences(): Readonly<UserPreferences> {
        return { ...this.preferences };
    }

    getPreference<K extends keyof UserPreferences>(key: K): UserPreferences[K] {
        return this.preferences[key];
    }
}

export { UserPreferencesManager, type UserPreferences };
```