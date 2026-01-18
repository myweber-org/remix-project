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

function validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  return {
    theme: ['light', 'dark', 'auto'].includes(prefs.theme || '') 
      ? prefs.theme as UserPreferences['theme'] 
      : DEFAULT_PREFERENCES.theme,
    notifications: typeof prefs.notifications === 'boolean' 
      ? prefs.notifications 
      : DEFAULT_PREFERENCES.notifications,
    language: typeof prefs.language === 'string' && prefs.language.length >= 2
      ? prefs.language
      : DEFAULT_PREFERENCES.language,
    timezone: typeof prefs.timezone === 'string' && Intl.supportedValuesOf('timeZone').includes(prefs.timezone)
      ? prefs.timezone
      : DEFAULT_PREFERENCES.timezone
  };
}

function mergeWithDefaults(prefs: Partial<UserPreferences>): UserPreferences {
  return { ...DEFAULT_PREFERENCES, ...validatePreferences(prefs) };
}

export { UserPreferences, validatePreferences, mergeWithDefaults };