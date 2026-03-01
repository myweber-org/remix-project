export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

export class PreferencesService {
  private readonly STORAGE_KEY = 'user_preferences';
  private defaultPreferences: UserPreferences = {
    theme: 'auto',
    language: 'en',
    notificationsEnabled: true,
    fontSize: 16
  };

  getPreferences(): UserPreferences {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      return { ...this.defaultPreferences, ...JSON.parse(stored) };
    }
    return { ...this.defaultPreferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const current = this.getPreferences();
    const updated = { ...current, ...updates };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    this.dispatchChangeEvent(updated);
  }

  resetToDefaults(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.dispatchChangeEvent(this.defaultPreferences);
  }

  private dispatchChangeEvent(preferences: UserPreferences): void {
    const event = new CustomEvent('preferenceschanged', {
      detail: preferences
    });
    window.dispatchEvent(event);
  }
}

export const preferencesService = new PreferencesService();