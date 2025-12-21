interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notificationsEnabled: boolean;
  itemsPerPage: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private defaultPreferences: UserPreferences = {
    theme: 'light',
    language: 'en',
    notificationsEnabled: true,
    itemsPerPage: 10
  };

  getPreferences(): UserPreferences {
    const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
    if (!stored) {
      return this.defaultPreferences;
    }

    try {
      const parsed = JSON.parse(stored);
      return this.validatePreferences(parsed);
    } catch {
      return this.defaultPreferences;
    }
  }

  savePreferences(preferences: Partial<UserPreferences>): void {
    const current = this.getPreferences();
    const updated = { ...current, ...preferences };
    const validated = this.validatePreferences(updated);
    
    localStorage.setItem(
      UserPreferencesManager.STORAGE_KEY,
      JSON.stringify(validated)
    );
  }

  resetToDefaults(): void {
    localStorage.removeItem(UserPreferencesManager.STORAGE_KEY);
  }

  private validatePreferences(data: unknown): UserPreferences {
    if (!data || typeof data !== 'object') {
      return this.defaultPreferences;
    }

    const prefs = data as Record<string, unknown>;
    
    return {
      theme: this.validateTheme(prefs.theme),
      language: this.validateLanguage(prefs.language),
      notificationsEnabled: this.validateBoolean(prefs.notificationsEnabled),
      itemsPerPage: this.validateNumber(prefs.itemsPerPage)
    };
  }

  private validateTheme(theme: unknown): 'light' | 'dark' {
    return theme === 'dark' ? 'dark' : 'light';
  }

  private validateLanguage(lang: unknown): string {
    return typeof lang === 'string' && lang.length === 2 ? lang : 'en';
  }

  private validateBoolean(value: unknown): boolean {
    return typeof value === 'boolean' ? value : true;
  }

  private validateNumber(value: unknown): number {
    const num = Number(value);
    return Number.isInteger(num) && num > 0 && num <= 100 ? num : 10;
  }
}

export const userPreferences = new UserPreferencesManager();