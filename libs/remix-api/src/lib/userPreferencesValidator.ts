typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  timezone: 'UTC'
};

class PreferenceValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en-US', 'fr-FR', 'de-DE', 'ja-JP'];
  private static readonly VALID_TIMEZONES = /^[A-Za-z_]+\/[A-Za-z_]+$/;

  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const merged = { ...DEFAULT_PREFERENCES, ...preferences };
    
    return {
      theme: this.validateTheme(merged.theme),
      notifications: this.validateNotifications(merged.notifications),
      language: this.validateLanguage(merged.language),
      timezone: this.validateTimezone(merged.timezone)
    };
  }

  private static validateTheme(theme: string): UserPreferences['theme'] {
    if (theme === 'light' || theme === 'dark' || theme === 'auto') {
      return theme;
    }
    console.warn(`Invalid theme "${theme}", falling back to "auto"`);
    return 'auto';
  }

  private static validateNotifications(notifications: unknown): boolean {
    return typeof notifications === 'boolean' ? notifications : true;
  }

  private static validateLanguage(language: string): string {
    if (this.SUPPORTED_LANGUAGES.includes(language)) {
      return language;
    }
    console.warn(`Unsupported language "${language}", falling back to "en-US"`);
    return 'en-US';
  }

  private static validateTimezone(timezone: string): string {
    if (this.VALID_TIMEZONES.test(timezone)) {
      return timezone;
    }
    console.warn(`Invalid timezone "${timezone}", falling back to "UTC"`);
    return 'UTC';
  }
}

export { UserPreferences, PreferenceValidator };
```