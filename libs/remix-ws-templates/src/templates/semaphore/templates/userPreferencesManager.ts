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

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 32;

class PreferencesManager {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    const stored = localStorage.getItem('userPreferences');
    if (!stored) return { ...DEFAULT_PREFERENCES };

    try {
      const parsed = JSON.parse(stored);
      return this.validatePreferences(parsed);
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  }

  private validatePreferences(data: unknown): UserPreferences {
    const prefs = { ...DEFAULT_PREFERENCES };

    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;

      if (['light', 'dark', 'auto'].includes(obj.theme as string)) {
        prefs.theme = obj.theme as UserPreferences['theme'];
      }

      if (typeof obj.notifications === 'boolean') {
        prefs.notifications = obj.notifications;
      }

      if (typeof obj.language === 'string' && VALID_LANGUAGES.includes(obj.language)) {
        prefs.language = obj.language;
      }

      if (typeof obj.fontSize === 'number') {
        prefs.fontSize = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, obj.fontSize));
      }
    }

    return prefs;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const newPreferences = { ...this.preferences, ...updates };
    this.preferences = this.validatePreferences(newPreferences);
    this.savePreferences();
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  private savePreferences(): void {
    localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
    this.dispatchChangeEvent();
  }

  private dispatchChangeEvent(): void {
    window.dispatchEvent(new CustomEvent('preferencesChanged', {
      detail: { preferences: this.preferences }
    }));
  }
}

export const preferencesManager = new PreferencesManager();