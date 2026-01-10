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

const VALID_LANGUAGES = new Set(['en-US', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP']);
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 32;
const MIN_AUTO_SAVE_INTERVAL = 5000;
const MAX_AUTO_SAVE_INTERVAL = 300000;

class UserPreferencesManager {
    private preferences: UserPreferences;
    private storageKey: string;

    constructor(userId: string) {
        this.storageKey = `user_preferences_${userId}`;
        this.preferences = this.loadPreferences();
    }

    private loadPreferences(): UserPreferences {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                return this.validateAndMergePreferences(parsed);
            }
        } catch (error) {
            console.warn('Failed to load preferences from storage:', error);
        }
        return { ...DEFAULT_PREFERENCES };
    }

    private validateAndMergePreferences(partial: Partial<UserPreferences>): UserPreferences {
        const merged = { ...DEFAULT_PREFERENCES, ...partial };
        
        if (!['light', 'dark', 'auto'].includes(merged.theme)) {
            merged.theme = DEFAULT_PREFERENCES.theme;
        }
        
        if (!VALID_LANGUAGES.has(merged.language)) {
            merged.language = DEFAULT_PREFERENCES.language;
        }
        
        merged.fontSize = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, merged.fontSize));
        merged.autoSaveInterval = Math.max(
            MIN_AUTO_SAVE_INTERVAL, 
            Math.min(MAX_AUTO_SAVE_INTERVAL, merged.autoSaveInterval)
        );
        
        return merged;
    }

    getPreferences(): Readonly<UserPreferences> {
        return { ...this.preferences };
    }

    updatePreferences(updates: Partial<UserPreferences>): boolean {
        const newPreferences = this.validateAndMergePreferences({
            ...this.preferences,
            ...updates
        });
        
        const hasChanged = JSON.stringify(newPreferences) !== JSON.stringify(this.preferences);
        
        if (hasChanged) {
            this.preferences = newPreferences;
            this.persistPreferences();
            this.notifyPreferencesChanged();
            return true;
        }
        
        return false;
    }

    resetToDefaults(): void {
        this.preferences = { ...DEFAULT_PREFERENCES };
        this.persistPreferences();
        this.notifyPreferencesChanged();
    }

    private persistPreferences(): void {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.preferences));
        } catch (error) {
            console.error('Failed to persist preferences:', error);
        }
    }

    private notifyPreferencesChanged(): void {
        window.dispatchEvent(new CustomEvent('userPreferencesChanged', {
            detail: { preferences: this.getPreferences() }
        }));
    }

    exportPreferences(): string {
        return JSON.stringify(this.preferences, null, 2);
    }

    importPreferences(jsonString: string): boolean {
        try {
            const parsed = JSON.parse(jsonString);
            return this.updatePreferences(parsed);
        } catch (error) {
            console.error('Failed to import preferences:', error);
            return false;
        }
    }
}

export { UserPreferencesManager, type UserPreferences };
```