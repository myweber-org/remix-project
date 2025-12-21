interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en-US',
  notifications: true,
  fontSize: 14
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];

export class PreferencesService {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    const stored = localStorage.getItem('userPreferences');
    if (!stored) return DEFAULT_PREFERENCES;

    try {
      const parsed = JSON.parse(stored);
      return this.validatePreferences(parsed);
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }

  private validatePreferences(data: unknown): UserPreferences {
    if (!data || typeof data !== 'object') return DEFAULT_PREFERENCES;

    const prefs = data as Partial<UserPreferences>;
    
    return {
      theme: this.isValidTheme(prefs.theme) ? prefs.theme : DEFAULT_PREFERENCES.theme,
      language: this.isValidLanguage(prefs.language) ? prefs.language : DEFAULT_PREFERENCES.language,
      notifications: typeof prefs.notifications === 'boolean' ? prefs.notifications : DEFAULT_PREFERENCES.notifications,
      fontSize: this.isValidFontSize(prefs.fontSize) ? prefs.fontSize : DEFAULT_PREFERENCES.fontSize
    };
  }

  private isValidTheme(theme: unknown): theme is UserPreferences['theme'] {
    return theme === 'light' || theme === 'dark' || theme === 'auto';
  }

  private isValidLanguage(language: unknown): boolean {
    return typeof language === 'string' && VALID_LANGUAGES.includes(language);
  }

  private isValidFontSize(size: unknown): boolean {
    return typeof size === 'number' && size >= 8 && size <= 24;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const newPreferences = { ...this.preferences, ...updates };
    this.preferences = this.validatePreferences(newPreferences);
    this.savePreferences();
  }

  private savePreferences(): void {
    localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  getCurrentTheme(): string {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return this.preferences.theme;
  }
}