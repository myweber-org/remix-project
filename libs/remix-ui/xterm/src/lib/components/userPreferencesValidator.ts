
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
  autoSave: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  fontSize: 14,
  autoSave: true
};

const THEME_VALUES = ['light', 'dark', 'auto'] as const;
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 32;
const SUPPORTED_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];

export function validatePreferences(input: Partial<UserPreferences>): UserPreferences {
  const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

  if (input.theme !== undefined) {
    if (THEME_VALUES.includes(input.theme)) {
      validated.theme = input.theme;
    } else {
      console.warn(`Invalid theme value: ${input.theme}. Using default.`);
    }
  }

  if (input.notifications !== undefined) {
    validated.notifications = Boolean(input.notifications);
  }

  if (input.language !== undefined) {
    if (SUPPORTED_LANGUAGES.includes(input.language)) {
      validated.language = input.language;
    } else {
      console.warn(`Unsupported language: ${input.language}. Using default.`);
    }
  }

  if (input.fontSize !== undefined) {
    const size = Number(input.fontSize);
    if (!isNaN(size) && size >= MIN_FONT_SIZE && size <= MAX_FONT_SIZE) {
      validated.fontSize = Math.round(size);
    } else {
      console.warn(`Font size ${input.fontSize} out of range. Using default.`);
    }
  }

  if (input.autoSave !== undefined) {
    validated.autoSave = Boolean(input.autoSave);
  }

  return validated;
}

export function arePreferencesEqual(a: UserPreferences, b: UserPreferences): boolean {
  return a.theme === b.theme &&
         a.notifications === b.notifications &&
         a.language === b.language &&
         a.fontSize === b.fontSize &&
         a.autoSave === b.autoSave;
}

export function getPreferencesDiff(current: UserPreferences, updated: UserPreferences): Partial<UserPreferences> {
  const diff: Partial<UserPreferences> = {};

  if (current.theme !== updated.theme) diff.theme = updated.theme;
  if (current.notifications !== updated.notifications) diff.notifications = updated.notifications;
  if (current.language !== updated.language) diff.language = updated.language;
  if (current.fontSize !== updated.fontSize) diff.fontSize = updated.fontSize;
  if (current.autoSave !== updated.autoSave) diff.autoSave = updated.autoSave;

  return diff;
}