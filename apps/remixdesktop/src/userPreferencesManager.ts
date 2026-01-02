interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private defaultPreferences: UserPreferences = {
    theme: 'auto',
    language: 'en-US',
    notificationsEnabled: true,
    fontSize: 16
  };

  getPreferences(): UserPreferences {
    const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
    if (!stored) return { ...this.defaultPreferences };

    try {
      const parsed = JSON.parse(stored);
      return this.validatePreferences(parsed);
    } catch {
      return { ...this.defaultPreferences };
    }
  }

  savePreferences(preferences: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const updated = { ...current, ...preferences };
    const validated = this.validatePreferences(updated);
    
    localStorage.setItem(
      UserPreferencesManager.STORAGE_KEY,
      JSON.stringify(validated)
    );
    
    return validated;
  }

  resetToDefaults(): UserPreferences {
    localStorage.removeItem(UserPreferencesManager.STORAGE_KEY);
    return { ...this.defaultPreferences };
  }

  private validatePreferences(data: unknown): UserPreferences {
    const preferences = data as Record<string, unknown>;
    
    return {
      theme: this.validateTheme(preferences.theme),
      language: typeof preferences.language === 'string' 
        ? preferences.language 
        : this.defaultPreferences.language,
      notificationsEnabled: typeof preferences.notificationsEnabled === 'boolean'
        ? preferences.notificationsEnabled
        : this.defaultPreferences.notificationsEnabled,
      fontSize: typeof preferences.fontSize === 'number' &&
                preferences.fontSize >= 8 &&
                preferences.fontSize <= 32
        ? preferences.fontSize
        : this.defaultPreferences.fontSize
    };
  }

  private validateTheme(theme: unknown): UserPreferences['theme'] {
    if (theme === 'light' || theme === 'dark' || theme === 'auto') {
      return theme;
    }
    return this.defaultPreferences.theme;
  }
}

export const userPreferences = new UserPreferencesManager();