export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

export class PreferenceManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private defaultPreferences: UserPreferences = {
    theme: 'auto',
    language: 'en-US',
    notificationsEnabled: true,
    fontSize: 14
  };

  loadPreferences(): UserPreferences {
    const stored = localStorage.getItem(PreferenceManager.STORAGE_KEY);
    if (stored) {
      try {
        return { ...this.defaultPreferences, ...JSON.parse(stored) };
      } catch {
        return this.defaultPreferences;
      }
    }
    return this.defaultPreferences;
  }

  savePreferences(prefs: Partial<UserPreferences>): void {
    const current = this.loadPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(PreferenceManager.STORAGE_KEY, JSON.stringify(updated));
  }

  resetToDefaults(): void {
    localStorage.removeItem(PreferenceManager.STORAGE_KEY);
  }

  validatePreferences(prefs: UserPreferences): boolean {
    return (
      ['light', 'dark', 'auto'].includes(prefs.theme) &&
      typeof prefs.language === 'string' &&
      typeof prefs.notificationsEnabled === 'boolean' &&
      prefs.fontSize >= 8 &&
      prefs.fontSize <= 32
    );
  }
}