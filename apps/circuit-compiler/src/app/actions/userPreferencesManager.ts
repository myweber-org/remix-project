typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  fontSize: number;
  autoSave: boolean;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private static readonly DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    language: 'en',
    notifications: true,
    fontSize: 14,
    autoSave: true
  };

  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  public getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  public updatePreferences(updates: Partial<UserPreferences>): void {
    const validatedUpdates = this.validateUpdates(updates);
    this.preferences = { ...this.preferences, ...validatedUpdates };
    this.savePreferences();
  }

  public resetToDefaults(): void {
    this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
    this.savePreferences();
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

  private validatePreferences(data: unknown): UserPreferences {
    const base = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
    
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      
      if (obj.theme && ['light', 'dark', 'auto'].includes(obj.theme as string)) {
        base.theme = obj.theme as 'light' | 'dark' | 'auto';
      }
      
      if (obj.language && typeof obj.language === 'string') {
        base.language = obj.language;
      }
      
      if (typeof obj.notifications === 'boolean') {
        base.notifications = obj.notifications;
      }
      
      if (typeof obj.fontSize === 'number' && obj.fontSize >= 8 && obj.fontSize <= 32) {
        base.fontSize = obj.fontSize;
      }
      
      if (typeof obj.autoSave === 'boolean') {
        base.autoSave = obj.autoSave;
      }
    }
    
    return base;
  }

  private validateUpdates(updates: Partial<UserPreferences>): Partial<UserPreferences> {
    const validated: Partial<UserPreferences> = {};
    
    if (updates.theme && ['light', 'dark', 'auto'].includes(updates.theme)) {
      validated.theme = updates.theme;
    }
    
    if (updates.language && typeof updates.language === 'string') {
      validated.language = updates.language;
    }
    
    if (typeof updates.notifications === 'boolean') {
      validated.notifications = updates.notifications;
    }
    
    if (typeof updates.fontSize === 'number' && updates.fontSize >= 8 && updates.fontSize <= 32) {
      validated.fontSize = updates.fontSize;
    }
    
    if (typeof updates.autoSave === 'boolean') {
      validated.autoSave = updates.autoSave;
    }
    
    return validated;
  }

  public exportPreferences(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  public importPreferences(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      this.preferences = this.validatePreferences(data);
      this.savePreferences();
      return true;
    } catch (error) {
      console.error('Failed to import preferences:', error);
      return false;
    }
  }
}

export { UserPreferencesManager, type UserPreferences };
```