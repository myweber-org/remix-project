interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor(defaultPreferences?: Partial<UserPreferences>) {
    this.preferences = this.loadPreferences();
    
    if (defaultPreferences) {
      this.preferences = { ...this.preferences, ...defaultPreferences };
    }
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage:', error);
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

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const oldPreferences = { ...this.preferences };
    
    try {
      this.preferences = { ...this.preferences, ...updates };
      this.validatePreferences(this.preferences);
      
      localStorage.setItem(
        UserPreferencesManager.STORAGE_KEY, 
        JSON.stringify(this.preferences)
      );
      
      this.notifyPreferencesChange(oldPreferences, this.preferences);
      return true;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      return false;
    }
  }

  private validatePreferences(prefs: UserPreferences): void {
    if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
      throw new Error('Invalid theme value');
    }

    if (typeof prefs.language !== 'string' || prefs.language.length === 0) {
      throw new Error('Invalid language value');
    }

    if (typeof prefs.notificationsEnabled !== 'boolean') {
      throw new Error('Invalid notificationsEnabled value');
    }

    if (typeof prefs.fontSize !== 'number' || prefs.fontSize < 8 || prefs.fontSize > 72) {
      throw new Error('Invalid fontSize value');
    }
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = this.getDefaultPreferences();
    localStorage.removeItem(UserPreferencesManager.STORAGE_KEY);
  }

  private notifyPreferencesChange(oldPrefs: UserPreferences, newPrefs: UserPreferences): void {
    const event = new CustomEvent('preferenceschanged', {
      detail: {
        oldPreferences: oldPrefs,
        newPreferences: newPrefs
      }
    });
    
    window.dispatchEvent(event);
  }

  static isPreferencesAvailable(): boolean {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch {
      return false;
    }
  }
}

export { UserPreferencesManager, type UserPreferences };