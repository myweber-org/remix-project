typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  fontSize: number;
  autoSave: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en-US',
  notifications: true,
  fontSize: 14,
  autoSave: true
};

const STORAGE_KEY = 'user_preferences';

class PreferencesManager {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private validatePreferences(data: unknown): data is UserPreferences {
    if (!data || typeof data !== 'object') return false;
    
    const prefs = data as Record<string, unknown>;
    
    const validThemes = ['light', 'dark', 'auto'];
    if (!prefs.theme || !validThemes.includes(prefs.theme as string)) {
      return false;
    }
    
    if (typeof prefs.language !== 'string' || prefs.language.trim() === '') {
      return false;
    }
    
    if (typeof prefs.notifications !== 'boolean') {
      return false;
    }
    
    if (typeof prefs.fontSize !== 'number' || prefs.fontSize < 8 || prefs.fontSize > 32) {
      return false;
    }
    
    return typeof prefs.autoSave === 'boolean';
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return { ...DEFAULT_PREFERENCES };

      const parsed = JSON.parse(stored);
      if (this.validatePreferences(parsed)) {
        return parsed;
      }
      
      console.warn('Invalid preferences found in storage, using defaults');
      return { ...DEFAULT_PREFERENCES };
    } catch (error) {
      console.error('Failed to load preferences:', error);
      return { ...DEFAULT_PREFERENCES };
    }
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = { ...this.preferences, ...updates };
    
    if (!this.validatePreferences(newPreferences)) {
      console.error('Invalid preference values provided');
      return false;
    }
    
    this.preferences = newPreferences;
    this.savePreferences();
    return true;
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  exportPreferences(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  importPreferences(json: string): boolean {
    try {
      const parsed = JSON.parse(json);
      if (this.validatePreferences(parsed)) {
        this.preferences = parsed;
        this.savePreferences();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

export const preferencesManager = new PreferencesManager();
```