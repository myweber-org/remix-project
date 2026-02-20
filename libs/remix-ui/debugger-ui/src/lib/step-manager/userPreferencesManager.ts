typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notificationsEnabled: boolean;
    fontSize: number;
    autoSave: boolean;
}

class UserPreferencesManager {
    private static readonly STORAGE_KEY = 'user_preferences';
    private static readonly DEFAULT_PREFERENCES: UserPreferences = {
        theme: 'auto',
        language: 'en-US',
        notificationsEnabled: true,
        fontSize: 14,
        autoSave: true
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

    private validatePreferences(data: any): UserPreferences {
        const validated: UserPreferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };

        if (typeof data.theme === 'string' && ['light', 'dark', 'auto'].includes(data.theme)) {
            validated.theme = data.theme;
        }

        if (typeof data.language === 'string' && data.language.length >= 2) {
            validated.language = data.language;
        }

        if (typeof data.notificationsEnabled === 'boolean') {
            validated.notificationsEnabled = data.notificationsEnabled;
        }

        if (typeof data.fontSize === 'number' && data.fontSize >= 8 && data.fontSize <= 32) {
            validated.fontSize = data.fontSize;
        }

        if (typeof data.autoSave === 'boolean') {
            validated.autoSave = data.autoSave;
        }

        return validated;
    }

    public getPreferences(): Readonly<UserPreferences> {
        return { ...this.preferences };
    }

    public updatePreferences(updates: Partial<UserPreferences>): boolean {
        const newPreferences = { ...this.preferences, ...updates };
        const validated = this.validatePreferences(newPreferences);

        if (JSON.stringify(validated) !== JSON.stringify(this.preferences)) {
            this.preferences = validated;
            this.savePreferences();
            return true;
        }
        return false;
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

    public resetToDefaults(): void {
        this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
        this.savePreferences();
    }

    public exportPreferences(): string {
        return JSON.stringify(this.preferences, null, 2);
    }

    public importPreferences(jsonString: string): boolean {
        try {
            const parsed = JSON.parse(jsonString);
            return this.updatePreferences(parsed);
        } catch (error) {
            console.error('Failed to import preferences:', error);
            return false;
        }
    }
}

export { UserPreferencesManager, type UserPreferences };
```import { BehaviorSubject, Observable } from 'rxjs';

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
          // Ignore invalid storage data
        }
      }
    });
  }
}