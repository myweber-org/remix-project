import { BehaviorSubject } from 'rxjs';

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notificationsEnabled: boolean;
  itemsPerPage: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  language: 'en-US',
  notificationsEnabled: true,
  itemsPerPage: 25
};

const STORAGE_KEY = 'app_user_preferences';

export class UserPreferencesManager {
  private readonly preferencesSubject: BehaviorSubject<UserPreferences>;

  constructor() {
    const saved = this.loadFromStorage();
    this.preferencesSubject = new BehaviorSubject<UserPreferences>(
      saved || DEFAULT_PREFERENCES
    );
  }

  get preferences$() {
    return this.preferencesSubject.asObservable();
  }

  get currentPreferences(): UserPreferences {
    return this.preferencesSubject.getValue();
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const current = this.currentPreferences;
    const updated = { ...current, ...updates };
    
    this.preferencesSubject.next(updated);
    this.saveToStorage(updated);
  }

  resetToDefaults(): void {
    this.preferencesSubject.next(DEFAULT_PREFERENCES);
    this.saveToStorage(DEFAULT_PREFERENCES);
  }

  private loadFromStorage(): UserPreferences | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private saveToStorage(preferences: UserPreferences): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }
}