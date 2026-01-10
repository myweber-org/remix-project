interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  fontSize: number;
  language: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  fontSize: 14,
  language: 'en-US'
};

function validatePreferences(input: unknown): UserPreferences {
  if (!input || typeof input !== 'object') {
    return DEFAULT_PREFERENCES;
  }

  const partial = input as Partial<UserPreferences>;
  
  return {
    theme: isValidTheme(partial.theme) ? partial.theme : DEFAULT_PREFERENCES.theme,
    notifications: typeof partial.notifications === 'boolean' 
      ? partial.notifications 
      : DEFAULT_PREFERENCES.notifications,
    fontSize: typeof partial.fontSize === 'number' && partial.fontSize >= 8 && partial.fontSize <= 32
      ? partial.fontSize
      : DEFAULT_PREFERENCES.fontSize,
    language: typeof partial.language === 'string' && partial.language.length >= 2
      ? partial.language
      : DEFAULT_PREFERENCES.language
  };
}

function isValidTheme(theme: unknown): theme is UserPreferences['theme'] {
  return theme === 'light' || theme === 'dark' || theme === 'auto';
}

function mergePreferences(existing: UserPreferences, updates: Partial<UserPreferences>): UserPreferences {
  const validatedUpdates = validatePreferences(updates);
  
  return {
    ...existing,
    ...validatedUpdates
  };
}

export { UserPreferences, validatePreferences, mergePreferences, DEFAULT_PREFERENCES };