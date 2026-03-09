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
    theme: prefs.theme && ['light', 'dark', 'auto'].includes(prefs.theme) 
      ? prefs.theme 
      : DEFAULT_PREFERENCES.theme,
    notifications: typeof prefs.notifications === 'boolean' 
      ? prefs.notifications 
      : DEFAULT_PREFERENCES.notifications,
    language: prefs.language && /^[a-z]{2}-[A-Z]{2}$/.test(prefs.language)
      ? prefs.language
      : DEFAULT_PREFERENCES.language,
    timezone: prefs.timezone && Intl.supportedValuesOf('timeZone').includes(prefs.timezone)
      ? prefs.timezone
      : DEFAULT_PREFERENCES.timezone
  };
}

function mergeWithDefaults(prefs: Partial<UserPreferences>): UserPreferences {
  return { ...DEFAULT_PREFERENCES, ...validatePreferences(prefs) };
}

export { UserPreferences, DEFAULT_PREFERENCES, validatePreferences, mergeWithDefaults };