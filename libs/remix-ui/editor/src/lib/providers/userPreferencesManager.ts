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
const MAX_FONT_SIZE = 24;

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
      return this.validateAndMerge(parsed);
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  }

  private validateAndMerge(partial: Partial<UserPreferences>): UserPreferences {
    const merged = { ...DEFAULT_PREFERENCES, ...partial };

    if (!['light', 'dark', 'auto'].includes(merged.theme)) {
      merged.theme = DEFAULT_PREFERENCES.theme;
    }

    if (typeof merged.notifications !== 'boolean') {
      merged.notifications = DEFAULT_PREFERENCES.notifications;
    }

    if (!VALID_LANGUAGES.includes(merged.language)) {
      merged.language = DEFAULT_PREFERENCES.language;
    }

    if (typeof merged.fontSize !== 'number' || 
        merged.fontSize < MIN_FONT_SIZE || 
        merged.fontSize > MAX_FONT_SIZE) {
      merged.fontSize = DEFAULT_PREFERENCES.fontSize;
    }

    return merged;
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = this.validateAndMerge(updates);
    
    if (JSON.stringify(this.preferences) === JSON.stringify(newPreferences)) {
      return false;
    }

    this.preferences = newPreferences;
    localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
    this.dispatchChangeEvent();
    return true;
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.updatePreferences(DEFAULT_PREFERENCES);
  }

  private dispatchChangeEvent(): void {
    window.dispatchEvent(new CustomEvent('preferencesChanged', {
      detail: { preferences: this.getPreferences() }
    }));
  }
}

export const preferencesManager = new PreferencesManager();