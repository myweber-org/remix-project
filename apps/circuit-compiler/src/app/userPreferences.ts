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
  const validated = { ...DEFAULT_PREFERENCES, ...prefs };
  
  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    validated.theme = 'auto';
  }
  
  if (typeof validated.notifications !== 'boolean') {
    validated.notifications = true;
  }
  
  if (!validated.language || typeof validated.language !== 'string') {
    validated.language = 'en-US';
  }
  
  if (!validated.timezone || typeof validated.timezone !== 'string') {
    validated.timezone = 'UTC';
  }
  
  return validated;
}

export function updateUserPreferences(
  userId: string, 
  preferences: Partial<UserPreferences>
): UserPreferences {
  const validatedPrefs = validatePreferences(preferences);
  console.log(`Updating preferences for user ${userId}:`, validatedPrefs);
  return validatedPrefs;
}