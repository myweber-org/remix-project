interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return this.getDefaultPreferences();
      }
    }
    return this.getDefaultPreferences();
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      language: 'en',
      notificationsEnabled: true,
      fontSize: 16
    };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const newPreferences = { ...this.preferences, ...updates };
    
    if (newPreferences.fontSize < 12 || newPreferences.fontSize > 24) {
      throw new Error('Font size must be between 12 and 24');
    }

    if (!['light', 'dark', 'auto'].includes(newPreferences.theme)) {
      throw new Error('Invalid theme value');
    }

    this.preferences = newPreferences;
    this.savePreferences();
  }

  private savePreferences(): void {
    localStorage.setItem(
      UserPreferencesManager.STORAGE_KEY,
      JSON.stringify(this.preferences)
    );
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = this.getDefaultPreferences();
    this.savePreferences();
  }
}

export { UserPreferencesManager, type UserPreferences };
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

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP'];
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 32;
const MIN_AUTO_SAVE_INTERVAL = 5000;
const MAX_AUTO_SAVE_INTERVAL = 300000;

class UserPreferencesManager {
  private preferences: UserPreferences;
  private readonly storageKey = 'user_preferences';

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validateAndMerge(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private validateAndMerge(partial: Partial<UserPreferences>): UserPreferences {
    const merged = { ...DEFAULT_PREFERENCES, ...partial };

    if (!['light', 'dark', 'auto'].includes(merged.theme)) {
      merged.theme = DEFAULT_PREFERENCES.theme;
    }

    if (!VALID_LANGUAGES.includes(merged.language)) {
      merged.language = DEFAULT_PREFERENCES.language;
    }

    if (typeof merged.notificationsEnabled !== 'boolean') {
      merged.notificationsEnabled = DEFAULT_PREFERENCES.notificationsEnabled;
    }

    merged.fontSize = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, 
      typeof merged.fontSize === 'number' ? merged.fontSize : DEFAULT_PREFERENCES.fontSize));

    merged.autoSaveInterval = Math.max(MIN_AUTO_SAVE_INTERVAL, Math.min(MAX_AUTO_SAVE_INTERVAL,
      typeof merged.autoSaveInterval === 'number' ? merged.autoSaveInterval : DEFAULT_PREFERENCES.autoSaveInterval));

    return merged;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = this.validateAndMerge({ ...this.preferences, ...updates });
    
    if (JSON.stringify(this.preferences) === JSON.stringify(newPreferences)) {
      return false;
    }

    this.preferences = newPreferences;
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.preferences));
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Failed to save preferences:', error);
      return false;
    }
  }

  resetToDefaults(): boolean {
    return this.updatePreferences(DEFAULT_PREFERENCES);
  }

  private listeners: Set<() => void> = new Set();

  addChangeListener(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in preferences change listener:', error);
      }
    });
  }

  exportPreferences(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  importPreferences(json: string): boolean {
    try {
      const parsed = JSON.parse(json);
      return this.updatePreferences(parsed);
    } catch (error) {
      console.error('Failed to import preferences:', error);
      return false;
    }
  }
}

export { UserPreferencesManager, type UserPreferences, VALID_LANGUAGES };