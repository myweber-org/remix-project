interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private defaultPreferences: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 16
  };

  getPreferences(): UserPreferences {
    const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
    if (stored) {
      try {
        return this.validatePreferences(JSON.parse(stored));
      } catch {
        return this.defaultPreferences;
      }
    }
    return this.defaultPreferences;
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const merged = { ...current, ...updates };
    const validated = this.validatePreferences(merged);
    
    localStorage.setItem(
      UserPreferencesManager.STORAGE_KEY,
      JSON.stringify(validated)
    );
    
    return validated;
  }

  resetToDefaults(): UserPreferences {
    localStorage.removeItem(UserPreferencesManager.STORAGE_KEY);
    return this.defaultPreferences;
  }

  private validatePreferences(prefs: any): UserPreferences {
    const validThemes = ['light', 'dark', 'auto'];
    const theme = validThemes.includes(prefs.theme) 
      ? prefs.theme 
      : this.defaultPreferences.theme;

    const notifications = typeof prefs.notifications === 'boolean'
      ? prefs.notifications
      : this.defaultPreferences.notifications;

    const language = typeof prefs.language === 'string' 
      ? prefs.language 
      : this.defaultPreferences.language;

    const fontSize = typeof prefs.fontSize === 'number' 
      ? Math.max(8, Math.min(72, prefs.fontSize))
      : this.defaultPreferences.fontSize;

    return { theme, notifications, language, fontSize };
  }
}

export const preferencesManager = new UserPreferencesManager();