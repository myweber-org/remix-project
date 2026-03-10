import { EventEmitter } from 'events';

export interface UserPreferences {
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  language: string;
  fontSize: number;
}

export class UserPreferencesManager extends EventEmitter {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor(defaultPreferences: UserPreferences) {
    super();
    this.preferences = this.loadPreferences() || defaultPreferences;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const oldPreferences = { ...this.preferences };
    this.preferences = { ...this.preferences, ...updates };
    
    if (JSON.stringify(oldPreferences) !== JSON.stringify(this.preferences)) {
      this.savePreferences();
      this.emit('preferencesChanged', this.preferences, oldPreferences);
    }
  }

  resetToDefaults(defaults: UserPreferences): void {
    this.updatePreferences(defaults);
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
    try {
      localStorage.setItem(
        UserPreferencesManager.STORAGE_KEY,
        JSON.stringify(this.preferences)
      );
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }
}

export const defaultPreferences: UserPreferences = {
  theme: 'light',
  notificationsEnabled: true,
  language: 'en-US',
  fontSize: 14
};