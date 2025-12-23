typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    fontSize: number;
    notificationsEnabled: boolean;
    language: string;
}

class UserPreferencesManager {
    private static readonly STORAGE_KEY = 'user_preferences';
    private preferences: UserPreferences;
    private listeners: Array<(prefs: UserPreferences) => void> = [];

    constructor() {
        this.preferences = this.loadPreferences();
        window.addEventListener('storage', this.handleStorageEvent.bind(this));
    }

    private loadPreferences(): UserPreferences {
        const defaultPrefs: UserPreferences = {
            theme: 'auto',
            fontSize: 16,
            notificationsEnabled: true,
            language: 'en-US'
        };

        try {
            const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
            if (stored) {
                return { ...defaultPrefs, ...JSON.parse(stored) };
            }
        } catch (error) {
            console.warn('Failed to load preferences from localStorage:', error);
        }

        return defaultPrefs;
    }

    private savePreferences(): void {
        try {
            localStorage.setItem(
                UserPreferencesManager.STORAGE_KEY,
                JSON.stringify(this.preferences)
            );
            this.notifyListeners();
        } catch (error) {
            console.error('Failed to save preferences:', error);
        }
    }

    private handleStorageEvent(event: StorageEvent): void {
        if (event.key === UserPreferencesManager.STORAGE_KEY) {
            this.preferences = this.loadPreferences();
            this.notifyListeners();
        }
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.preferences));
    }

    getPreferences(): UserPreferences {
        return { ...this.preferences };
    }

    updatePreferences(updates: Partial<UserPreferences>): void {
        this.preferences = { ...this.preferences, ...updates };
        this.savePreferences();
    }

    resetToDefaults(): void {
        this.preferences = this.loadPreferences();
        localStorage.removeItem(UserPreferencesManager.STORAGE_KEY);
        this.notifyListeners();
    }

    subscribe(listener: (prefs: UserPreferences) => void): () => void {
        this.listeners.push(listener);
        listener(this.preferences);
        
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    applyTheme(): void {
        const theme = this.preferences.theme;
        let effectiveTheme: 'light' | 'dark';
        
        if (theme === 'auto') {
            effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } else {
            effectiveTheme = theme;
        }

        document.documentElement.setAttribute('data-theme', effectiveTheme);
    }

    applyFontSize(): void {
        document.documentElement.style.fontSize = `${this.preferences.fontSize}px`;
    }
}

export const userPreferences = new UserPreferencesManager();
```