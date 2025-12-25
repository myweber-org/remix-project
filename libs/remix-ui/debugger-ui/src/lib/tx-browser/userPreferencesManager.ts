typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    fontSize: number;
    autoSave: boolean;
}

class UserPreferencesManager {
    private static readonly STORAGE_KEY = 'user_preferences';
    private static readonly DEFAULT_PREFERENCES: UserPreferences = {
        theme: 'auto',
        notifications: true,
        language: 'en-US',
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

    private validatePreferences(data: any): UserPreferences {
        const validThemes = ['light', 'dark', 'auto'];
        const defaultPrefs = UserPreferencesManager.DEFAULT_PREFERENCES;

        return {
            theme: validThemes.includes(data.theme) ? data.theme : defaultPrefs.theme,
            notifications: typeof data.notifications === 'boolean' ? data.notifications : defaultPrefs.notifications,
            language: typeof data.language === 'string' ? data.language : defaultPrefs.language,
            fontSize: typeof data.fontSize === 'number' && data.fontSize >= 8 && data.fontSize <= 32 
                ? data.fontSize 
                : defaultPrefs.fontSize,
            autoSave: typeof data.autoSave === 'boolean' ? data.autoSave : defaultPrefs.autoSave
        };
    }

    public getPreferences(): UserPreferences {
        return { ...this.preferences };
    }

    public updatePreferences(updates: Partial<UserPreferences>): boolean {
        const newPreferences = { ...this.preferences, ...updates };
        const validated = this.validatePreferences(newPreferences);

        if (this.arePreferencesEqual(this.preferences, validated)) {
            return false;
        }

        this.preferences = validated;
        this.savePreferences();
        return true;
    }

    private arePreferencesEqual(a: UserPreferences, b: UserPreferences): boolean {
        return a.theme === b.theme &&
               a.notifications === b.notifications &&
               a.language === b.language &&
               a.fontSize === b.fontSize &&
               a.autoSave === b.autoSave;
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

    public resetToDefaults(): void {
        this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
        this.savePreferences();
    }

    public exportPreferences(): string {
        return JSON.stringify(this.preferences, null, 2);
    }

    public importPreferences(jsonString: string): boolean {
        try {
            const parsed = JSON.parse(jsonString);
            return this.updatePreferences(parsed);
        } catch (error) {
            console.error('Failed to import preferences:', error);
            return false;
        }
    }
}

// Usage example
const preferencesManager = new UserPreferencesManager();
console.log('Current preferences:', preferencesManager.getPreferences());

const updated = preferencesManager.updatePreferences({ theme: 'dark', fontSize: 16 });
if (updated) {
    console.log('Preferences updated successfully');
}

const exported = preferencesManager.exportPreferences();
console.log('Exported preferences:', exported);
```