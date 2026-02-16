import { z } from 'zod';

const ThemeSchema = z.enum(['light', 'dark', 'system']);
const NotificationLevelSchema = z.enum(['none', 'essential', 'all']);

export const UserPreferencesSchema = z.object({
  userId: z.string().uuid(),
  theme: ThemeSchema.default('system'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    level: NotificationLevelSchema.default('essential'),
  }),
  privacy: z.object({
    profileVisible: z.boolean().default(true),
    searchIndexed: z.boolean().default(true),
    dataSharing: z.boolean().default(false),
  }),
  updatedAt: z.date().default(() => new Date()),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validatePreferences(input: unknown): UserPreferences {
  return UserPreferencesSchema.parse(input);
}

export function sanitizePreferencesUpdate(
  current: UserPreferences,
  update: Partial<UserPreferences>
): Partial<UserPreferences> {
  const sanitized: Partial<UserPreferences> = {};

  if (update.theme && ThemeSchema.safeParse(update.theme).success) {
    sanitized.theme = update.theme;
  }

  if (update.notifications) {
    sanitized.notifications = { ...current.notifications };
    
    if (typeof update.notifications.email === 'boolean') {
      sanitized.notifications.email = update.notifications.email;
    }
    
    if (typeof update.notifications.push === 'boolean') {
      sanitized.notifications.push = update.notifications.push;
    }
    
    if (update.notifications.level && 
        NotificationLevelSchema.safeParse(update.notifications.level).success) {
      sanitized.notifications.level = update.notifications.level;
    }
  }

  if (update.privacy) {
    sanitized.privacy = { ...current.privacy };
    
    if (typeof update.privacy.profileVisible === 'boolean') {
      sanitized.privacy.profileVisible = update.privacy.profileVisible;
    }
    
    if (typeof update.privacy.searchIndexed === 'boolean') {
      sanitized.privacy.searchIndexed = update.privacy.searchIndexed;
    }
    
    if (typeof update.privacy.dataSharing === 'boolean') {
      sanitized.privacy.dataSharing = update.privacy.dataSharing;
    }
  }

  if (Object.keys(sanitized).length > 0) {
    sanitized.updatedAt = new Date();
  }

  return sanitized;
}interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceError';
  }
}

function validateUserPreferences(prefs: UserPreferences): void {
  const validThemes = ['light', 'dark', 'auto'];
  
  if (!validThemes.includes(prefs.theme)) {
    throw new PreferenceError(`Invalid theme: ${prefs.theme}. Must be one of: ${validThemes.join(', ')}`);
  }
  
  if (typeof prefs.notifications !== 'boolean') {
    throw new PreferenceError('Notifications must be a boolean value');
  }
  
  if (!prefs.language || prefs.language.trim().length === 0) {
    throw new PreferenceError('Language must be a non-empty string');
  }
  
  if (prefs.fontSize < 12 || prefs.fontSize > 24) {
    throw new PreferenceError('Font size must be between 12 and 24');
  }
}

function saveUserPreferences(prefs: UserPreferences): boolean {
  try {
    validateUserPreferences(prefs);
    console.log('Preferences validated successfully');
    return true;
  } catch (error) {
    if (error instanceof PreferenceError) {
      console.error(`Validation failed: ${error.message}`);
      return false;
    }
    throw error;
  }
}

export { UserPreferences, validateUserPreferences, saveUserPreferences, PreferenceError };