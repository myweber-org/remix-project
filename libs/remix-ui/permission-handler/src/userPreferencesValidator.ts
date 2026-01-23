interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  itemsPerPage: 25
};

const THEME_VALUES = ['light', 'dark', 'auto'] as const;

function validatePreferences(input: unknown): UserPreferences {
  if (!input || typeof input !== 'object') {
    return DEFAULT_PREFERENCES;
  }

  const partial = input as Partial<UserPreferences>;
  
  return {
    theme: THEME_VALUES.includes(partial.theme as any) 
      ? partial.theme as UserPreferences['theme']
      : DEFAULT_PREFERENCES.theme,
    
    notifications: typeof partial.notifications === 'boolean'
      ? partial.notifications
      : DEFAULT_PREFERENCES.notifications,
    
    language: typeof partial.language === 'string' 
      && partial.language.length >= 2
      ? partial.language
      : DEFAULT_PREFERENCES.language,
    
    itemsPerPage: typeof partial.itemsPerPage === 'number'
      && partial.itemsPerPage > 0
      && partial.itemsPerPage <= 100
      ? Math.floor(partial.itemsPerPage)
      : DEFAULT_PREFERENCES.itemsPerPage
  };
}

function mergePreferences(
  existing: UserPreferences,
  updates: Partial<UserPreferences>
): UserPreferences {
  const validatedUpdates = validatePreferences(updates);
  
  return {
    ...existing,
    ...validatedUpdates
  };
}

export { UserPreferences, validatePreferences, mergePreferences, DEFAULT_PREFERENCES };