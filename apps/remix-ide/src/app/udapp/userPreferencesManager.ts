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

const STORAGE_KEY = 'user_preferences';

class UserPreferencesManager {
    private preferences: UserPreferences;

    constructor() {
        this.preferences = this.loadPreferences();
    }

    private loadPreferences(): UserPreferences {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return this.validatePreferences(parsed);
            }
        } catch (error) {
            console.warn('Failed to load preferences from storage:', error);
        }
        return { ...DEFAULT_PREFERENCES };
    }

    private validatePreferences(data: any): UserPreferences {
        return {
            theme: this.isValidTheme(data.theme) ? data.theme : DEFAULT_PREFERENCES.theme,
            notifications: typeof data.notifications === 'boolean' ? data.notifications : DEFAULT_PREFERENCES.notifications,
            language: typeof data.language === 'string' ? data.language : DEFAULT_PREFERENCES.language,
            fontSize: typeof data.fontSize === 'number' && data.fontSize >= 8 && data.fontSize <= 32 
                ? data.fontSize 
                : DEFAULT_PREFERENCES.fontSize
        };
    }

    private isValidTheme(theme: any): theme is UserPreferences['theme'] {
        return ['light', 'dark', 'auto'].includes(theme);
    }

    getPreferences(): UserPreferences {
        return { ...this.preferences };
    }

    updatePreferences(updates: Partial<UserPreferences>): void {
        this.preferences = {
            ...this.preferences,
            ...this.validatePreferences(updates)
        };
        this.savePreferences();
    }

    private savePreferences(): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
        } catch (error) {
            console.error('Failed to save preferences:', error);
        }
    }

    resetToDefaults(): void {
        this.preferences = { ...DEFAULT_PREFERENCES };
        this.savePreferences();
    }

    isDarkMode(): boolean {
        if (this.preferences.theme === 'auto') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return this.preferences.theme === 'dark';
    }
}

export const userPreferences = new UserPreferencesManager();
```