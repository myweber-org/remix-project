typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en-US',
  notifications: true,
  fontSize: 14
};

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  
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
    return { ...DEFAULT_PREFERENCES };
  }
  
  private validatePreferences(data: unknown): UserPreferences {
    if (!data || typeof data !== 'object') {
      return { ...DEFAULT_PREFERENCES };
    }
    
    const prefs = data as Partial<UserPreferences>;
    
    return {
      theme: this.isValidTheme(prefs.theme) ? prefs.theme : DEFAULT_PREFERENCES.theme,
      language: typeof prefs.language === 'string' ? prefs.language : DEFAULT_PREFERENCES.language,
      notifications: typeof prefs.notifications === 'boolean' ? prefs.notifications : DEFAULT_PREFERENCES.notifications,
      fontSize: typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 32 
        ? prefs.fontSize 
        : DEFAULT_PREFERENCES.fontSize
    };
  }
  
  private isValidTheme(theme: unknown): theme is UserPreferences['theme'] {
    return theme === 'light' || theme === 'dark' || theme === 'auto';
  }
  
  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }
  
  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = {
      ...this.preferences,
      ...updates
    };
    
    const validated = this.validatePreferences(newPreferences);
    
    if (JSON.stringify(this.preferences) !== JSON.stringify(validated)) {
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
      return this.updatePreferences(parsed);
    } catch (error) {
      console.error('Failed to import preferences:', error);
      return false;
    }
  }
}

// Usage example
const preferencesManager = new UserPreferencesManager();

// Subscribe to storage changes
window.addEventListener('storage', (event) => {
  if (event.key === UserPreferencesManager.STORAGE_KEY) {
    console.log('Preferences updated in another tab');
    // Could reload preferences here if needed
  }
});

export { UserPreferencesManager, type UserPreferences };
```