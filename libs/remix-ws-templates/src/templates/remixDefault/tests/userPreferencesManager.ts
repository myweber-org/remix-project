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
    this.preferences = this.loadPreferences() || this.getDefaultPreferences();
    if (defaultPreferences) {
      this.updatePreferences(defaultPreferences);
    }
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      language: 'en-US',
      notificationsEnabled: true,
      fontSize: 16
    };
  }

  private loadPreferences(): UserPreferences | null {
    try {
      const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
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

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const validated = this.validateUpdates(updates);
    if (!validated) return false;

    this.preferences = { ...this.preferences, ...validated };
    this.savePreferences();
    return true;
  }

  private validateUpdates(updates: Partial<UserPreferences>): Partial<UserPreferences> | null {
    const validated: Partial<UserPreferences> = {};

    if (updates.theme !== undefined) {
      if (!['light', 'dark', 'auto'].includes(updates.theme)) {
        console.error('Invalid theme value');
        return null;
      }
      validated.theme = updates.theme;
    }

    if (updates.language !== undefined) {
      if (typeof updates.language !== 'string' || updates.language.length < 2) {
        console.error('Invalid language value');
        return null;
      }
      validated.language = updates.language;
    }

    if (updates.notificationsEnabled !== undefined) {
      if (typeof updates.notificationsEnabled !== 'boolean') {
        console.error('Invalid notificationsEnabled value');
        return null;
      }
      validated.notificationsEnabled = updates.notificationsEnabled;
    }

    if (updates.fontSize !== undefined) {
      if (typeof updates.fontSize !== 'number' || updates.fontSize < 8 || updates.fontSize > 72) {
        console.error('Invalid fontSize value');
        return null;
      }
      validated.fontSize = updates.fontSize;
    }

    return validated;
  }

  resetToDefaults(): void {
    this.preferences = this.getDefaultPreferences();
    this.savePreferences();
  }

  clearPreferences(): void {
    localStorage.removeItem(UserPreferencesManager.STORAGE_KEY);
    this.preferences = this.getDefaultPreferences();
  }
}

export { UserPreferencesManager, type UserPreferences };