interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en-US',
  notificationsEnabled: true,
  fontSize: 14
};

class UserPreferencesManager {
  private readonly STORAGE_KEY = 'user_preferences';

  getPreferences(): UserPreferences {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    
    if (!stored) {
      return this.savePreferences(DEFAULT_PREFERENCES);
    }

    try {
      const parsed = JSON.parse(stored);
      return this.validateAndMergePreferences(parsed);
    } catch {
      return this.savePreferences(DEFAULT_PREFERENCES);
    }
  }

  savePreferences(preferences: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const merged = { ...current, ...preferences };
    const validated = this.validatePreferences(merged);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(validated));
    return validated;
  }

  resetToDefaults(): UserPreferences {
    return this.savePreferences(DEFAULT_PREFERENCES);
  }

  private validatePreferences(prefs: UserPreferences): UserPreferences {
    return {
      theme: ['light', 'dark', 'auto'].includes(prefs.theme) ? prefs.theme : DEFAULT_PREFERENCES.theme,
      language: typeof prefs.language === 'string' ? prefs.language : DEFAULT_PREFERENCES.language,
      notificationsEnabled: typeof prefs.notificationsEnabled === 'boolean' 
        ? prefs.notificationsEnabled 
        : DEFAULT_PREFERENCES.notificationsEnabled,
      fontSize: typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 32
        ? prefs.fontSize
        : DEFAULT_PREFERENCES.fontSize
    };
  }

  private validateAndMergePreferences(parsed: unknown): UserPreferences {
    if (typeof parsed !== 'object' || parsed === null) {
      return DEFAULT_PREFERENCES;
    }

    const partialPrefs: Partial<UserPreferences> = {};
    const raw = parsed as Record<string, unknown>;

    if (['light', 'dark', 'auto'].includes(raw.theme as string)) {
      partialPrefs.theme = raw.theme as UserPreferences['theme'];
    }

    if (typeof raw.language === 'string') {
      partialPrefs.language = raw.language;
    }

    if (typeof raw.notificationsEnabled === 'boolean') {
      partialPrefs.notificationsEnabled = raw.notificationsEnabled;
    }

    if (typeof raw.fontSize === 'number' && raw.fontSize >= 8 && raw.fontSize <= 32) {
      partialPrefs.fontSize = raw.fontSize;
    }

    return { ...DEFAULT_PREFERENCES, ...partialPrefs };
  }
}

export const userPreferences = new UserPreferencesManager();