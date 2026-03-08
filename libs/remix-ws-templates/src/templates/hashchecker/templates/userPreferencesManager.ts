
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  fontSize: number;
  language: string;
}

class UserPreferencesManager {
  private static readonly DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    notifications: true,
    fontSize: 16,
    language: 'en-US'
  };

  private static readonly VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
  private static readonly MIN_FONT_SIZE = 8;
  private static readonly MAX_FONT_SIZE = 32;

  private preferences: UserPreferences;

  constructor(initialPreferences?: Partial<UserPreferences>) {
    this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES, ...initialPreferences };
    this.validateAndNormalize();
  }

  private validateAndNormalize(): void {
    if (!['light', 'dark', 'auto'].includes(this.preferences.theme)) {
      this.preferences.theme = UserPreferencesManager.DEFAULT_PREFERENCES.theme;
    }

    if (typeof this.preferences.notifications !== 'boolean') {
      this.preferences.notifications = UserPreferencesManager.DEFAULT_PREFERENCES.notifications;
    }

    if (typeof this.preferences.fontSize !== 'number' || 
        this.preferences.fontSize < UserPreferencesManager.MIN_FONT_SIZE || 
        this.preferences.fontSize > UserPreferencesManager.MAX_FONT_SIZE) {
      this.preferences.fontSize = UserPreferencesManager.DEFAULT_PREFERENCES.fontSize;
    }

    if (!UserPreferencesManager.VALID_LANGUAGES.includes(this.preferences.language)) {
      this.preferences.language = UserPreferencesManager.DEFAULT_PREFERENCES.language;
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
    this.validateAndNormalize();
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
  }

  exportAsJSON(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  static importFromJSON(jsonString: string): UserPreferencesManager {
    try {
      const parsed = JSON.parse(jsonString);
      return new UserPreferencesManager(parsed);
    } catch {
      return new UserPreferencesManager();
    }
  }
}

export { UserPreferencesManager, type UserPreferences };typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    fontSize: number;
}

class UserPreferencesManager {
    private static readonly STORAGE_KEY = 'user_preferences';
    private static readonly DEFAULT_PREFERENCES: UserPreferences = {
        theme: 'auto',
        notifications: true,
        language: 'en-US',
        fontSize: 16
    };

    private preferences: UserPreferences;

    constructor() {
        this.preferences = this.loadPreferences();
    }

    private loadPreferences(): UserPreferences {
        try {
            const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return this.validatePreferences(parsed);
            }
        } catch (error) {
            console.warn('Failed to load preferences from storage:', error);
        }
        return { ...UserPreferencesManager.DEFAULT_PREFERENCES };
    }

    private validatePreferences(data: unknown): UserPreferences {
        const defaultPrefs = UserPreferencesManager.DEFAULT_PREFERENCES;
        
        if (!data || typeof data !== 'object') {
            return { ...defaultPrefs };
        }

        const prefs = data as Record<string, unknown>;
        
        return {
            theme: this.isValidTheme(prefs.theme) ? prefs.theme : defaultPrefs.theme,
            notifications: typeof prefs.notifications === 'boolean' 
                ? prefs.notifications 
                : defaultPrefs.notifications,
            language: typeof prefs.language === 'string' 
                ? prefs.language 
                : defaultPrefs.language,
            fontSize: typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 32
                ? prefs.fontSize
                : defaultPrefs.fontSize
        };
    }

    private isValidTheme(theme: unknown): theme is UserPreferences['theme'] {
        return theme === 'light' || theme === 'dark' || theme === 'auto';
    }

    getPreferences(): Readonly<UserPreferences> {
        return { ...this.preferences };
    }

    updatePreferences(updates: Partial<UserPreferences>): boolean {
        const newPreferences = { ...this.preferences, ...updates };
        
        if (!this.validateUpdate(newPreferences)) {
            return false;
        }

        this.preferences = newPreferences;
        this.savePreferences();
        return true;
    }

    private validateUpdate(preferences: UserPreferences): boolean {
        return (
            this.isValidTheme(preferences.theme) &&
            typeof preferences.notifications === 'boolean' &&
            typeof preferences.language === 'string' &&
            typeof preferences.fontSize === 'number' &&
            preferences.fontSize >= 8 &&
            preferences.fontSize <= 32
        );
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

    resetToDefaults(): void {
        this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
        this.savePreferences();
    }

    hasUnsavedChanges(): boolean {
        const saved = this.loadPreferences();
        return JSON.stringify(this.preferences) !== JSON.stringify(saved);
    }
}

export { UserPreferencesManager, type UserPreferences };
```
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor(defaultPreferences: UserPreferences) {
    this.preferences = this.loadPreferences() || defaultPreferences;
  }

  private loadPreferences(): UserPreferences | null {
    try {
      const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const newPreferences = { ...this.preferences, ...updates };
    
    if (this.validatePreferences(newPreferences)) {
      this.preferences = newPreferences;
      this.savePreferences();
    } else {
      throw new Error('Invalid preferences provided');
    }
  }

  private validatePreferences(prefs: UserPreferences): boolean {
    const validThemes = ['light', 'dark', 'auto'];
    return (
      validThemes.includes(prefs.theme) &&
      typeof prefs.language === 'string' &&
      prefs.language.length >= 2 &&
      typeof prefs.notificationsEnabled === 'boolean' &&
      prefs.fontSize >= 8 &&
      prefs.fontSize <= 32
    );
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

  resetToDefaults(defaults: UserPreferences): void {
    this.preferences = defaults;
    this.savePreferences();
  }
}

const defaultPreferences: UserPreferences = {
  theme: 'auto',
  language: 'en',
  notificationsEnabled: true,
  fontSize: 16
};

export const userPrefsManager = new UserPreferencesManager(defaultPreferences);
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class UserPreferencesManager {
  private readonly STORAGE_KEY = 'user_preferences';
  private defaultPreferences: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en-US',
    fontSize: 14
  };

  getPreferences(): UserPreferences {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return this.validateAndMerge(parsed);
      } catch {
        return { ...this.defaultPreferences };
      }
    }
    return { ...this.defaultPreferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const merged = { ...current, ...updates };
    const validated = this.validateAndMerge(merged);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(validated));
    return validated;
  }

  resetToDefaults(): UserPreferences {
    localStorage.removeItem(this.STORAGE_KEY);
    return { ...this.defaultPreferences };
  }

  private validateAndMerge(prefs: any): UserPreferences {
    const validThemes: UserPreferences['theme'][] = ['light', 'dark', 'auto'];
    const theme = validThemes.includes(prefs.theme) ? prefs.theme : this.defaultPreferences.theme;
    
    const notifications = typeof prefs.notifications === 'boolean' 
      ? prefs.notifications 
      : this.defaultPreferences.notifications;
    
    const language = typeof prefs.language === 'string' && prefs.language.length > 0
      ? prefs.language
      : this.defaultPreferences.language;
    
    const fontSize = typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 32
      ? prefs.fontSize
      : this.defaultPreferences.fontSize;

    return { theme, notifications, language, fontSize };
  }

  subscribe(callback: (prefs: UserPreferences) => void): () => void {
    const handler = (event: StorageEvent) => {
      if (event.key === this.STORAGE_KEY) {
        callback(this.getPreferences());
      }
    };
    
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }
}

export const preferencesManager = new UserPreferencesManager();import { BehaviorSubject, Observable } from 'rxjs';

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
  private preferencesSubject: BehaviorSubject<UserPreferences>;
  public preferences$: Observable<UserPreferences>;

  constructor() {
    const savedPreferences = this.loadFromStorage();
    const initialPreferences = { ...DEFAULT_PREFERENCES, ...savedPreferences };
    
    this.preferencesSubject = new BehaviorSubject<UserPreferences>(initialPreferences);
    this.preferences$ = this.preferencesSubject.asObservable();
    
    this.setupStorageListener();
  }

  public updatePreferences(updates: Partial<UserPreferences>): void {
    const current = this.preferencesSubject.getValue();
    const updated = { ...current, ...updates };
    
    this.preferencesSubject.next(updated);
    this.saveToStorage(updated);
  }

  public resetToDefaults(): void {
    this.preferencesSubject.next(DEFAULT_PREFERENCES);
    this.saveToStorage(DEFAULT_PREFERENCES);
  }

  public getCurrentPreferences(): UserPreferences {
    return this.preferencesSubject.getValue();
  }

  private loadFromStorage(): Partial<UserPreferences> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private saveToStorage(preferences: UserPreferences): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to save preferences to localStorage:', error);
    }
  }

  private setupStorageListener(): void {
    window.addEventListener('storage', (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const newPreferences = JSON.parse(event.newValue);
          this.preferencesSubject.next(newPreferences);
        } catch {
          console.warn('Failed to parse storage update');
        }
      }
    });
  }
}interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
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
        return this.validatePreferences(JSON.parse(stored));
      } catch {
        return this.getDefaultPreferences();
      }
    }
    return this.getDefaultPreferences();
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 14
    };
  }

  private validatePreferences(data: any): UserPreferences {
    const validThemes = ['light', 'dark', 'auto'];
    const theme = validThemes.includes(data.theme) ? data.theme : 'auto';
    const notifications = typeof data.notifications === 'boolean' ? data.notifications : true;
    const language = typeof data.language === 'string' ? data.language.substring(0, 5) : 'en';
    const fontSize = typeof data.fontSize === 'number' && data.fontSize >= 8 && data.fontSize <= 24 
      ? data.fontSize : 14;

    return { theme, notifications, language, fontSize };
  }

  public updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = this.validatePreferences({
      ...this.preferences,
      ...updates
    });
    this.savePreferences();
  }

  private savePreferences(): void {
    localStorage.setItem(
      UserPreferencesManager.STORAGE_KEY,
      JSON.stringify(this.preferences)
    );
  }

  public getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  public resetToDefaults(): void {
    this.preferences = this.getDefaultPreferences();
    this.savePreferences();
  }
}

export { UserPreferencesManager, type UserPreferences };