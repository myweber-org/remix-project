interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  fontSize: 14
};

class PreferencesManager {
  private storageKey = 'user_preferences';

  loadPreferences(): UserPreferences {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return { ...DEFAULT_PREFERENCES };

    try {
      const parsed = JSON.parse(stored);
      return this.validatePreferences(parsed);
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  }

  savePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    const current = this.loadPreferences();
    const merged = { ...current, ...prefs };
    const validated = this.validatePreferences(merged);
    
    localStorage.setItem(this.storageKey, JSON.stringify(validated));
    return validated;
  }

  resetToDefaults(): UserPreferences {
    localStorage.removeItem(this.storageKey);
    return { ...DEFAULT_PREFERENCES };
  }

  private validatePreferences(prefs: any): UserPreferences {
    const validThemes = ['light', 'dark', 'auto'];
    const theme = validThemes.includes(prefs.theme) ? prefs.theme : DEFAULT_PREFERENCES.theme;
    
    const notifications = typeof prefs.notifications === 'boolean' 
      ? prefs.notifications 
      : DEFAULT_PREFERENCES.notifications;
    
    const language = typeof prefs.language === 'string' && prefs.language.length === 2
      ? prefs.language
      : DEFAULT_PREFERENCES.language;
    
    const fontSize = typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 24
      ? prefs.fontSize
      : DEFAULT_PREFERENCES.fontSize;

    return { theme, notifications, language, fontSize };
  }
}

export const preferencesManager = new PreferencesManager();