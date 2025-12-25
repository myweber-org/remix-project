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

const THEME_VALUES = ['light', 'dark', 'auto'] as const;
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 32;
const MIN_AUTO_SAVE_INTERVAL = 5000;
const MAX_AUTO_SAVE_INTERVAL = 300000;

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor(initialPreferences?: Partial<UserPreferences>) {
    this.preferences = { ...DEFAULT_PREFERENCES, ...initialPreferences };
    this.validateAndNormalize();
  }

  private validateAndNormalize(): void {
    if (!THEME_VALUES.includes(this.preferences.theme)) {
      this.preferences.theme = DEFAULT_PREFERENCES.theme;
    }

    if (typeof this.preferences.language !== 'string' || this.preferences.language.trim().length === 0) {
      this.preferences.language = DEFAULT_PREFERENCES.language;
    }

    if (typeof this.preferences.notificationsEnabled !== 'boolean') {
      this.preferences.notificationsEnabled = DEFAULT_PREFERENCES.notificationsEnabled;
    }

    this.preferences.fontSize = Math.max(
      MIN_FONT_SIZE,
      Math.min(MAX_FONT_SIZE, this.preferences.fontSize)
    );

    this.preferences.autoSaveInterval = Math.max(
      MIN_AUTO_SAVE_INTERVAL,
      Math.min(MAX_AUTO_SAVE_INTERVAL, this.preferences.autoSaveInterval)
    );
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const previousPreferences = { ...this.preferences };
    this.preferences = { ...this.preferences, ...updates };
    
    try {
      this.validateAndNormalize();
      return true;
    } catch (error) {
      this.preferences = previousPreferences;
      return false;
    }
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
  }

  exportAsJSON(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  static importFromJSON(jsonString: string): UserPreferencesManager {
    try {
      const parsed = JSON.parse(jsonString);
      return new UserPreferencesManager(parsed);
    } catch {
      return new UserPreferencesManager();
    }
  }

  isDarkMode(): boolean {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.preferences.theme === 'dark';
  }
}

export { UserPreferencesManager, type UserPreferences };
```