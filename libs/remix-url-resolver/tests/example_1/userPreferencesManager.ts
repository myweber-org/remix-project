import { z } from 'zod';

const PreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notificationsEnabled: z.boolean().default(true),
  itemsPerPage: z.number().min(5).max(100).default(25),
  language: z.string().min(2).default('en'),
  lastUpdated: z.date().optional()
});

type UserPreferences = z.infer<typeof PreferencesSchema>;

const STORAGE_KEY = 'user_preferences_v1';

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return PreferencesSchema.parse({});

      const parsed = JSON.parse(stored);
      parsed.lastUpdated = parsed.lastUpdated ? new Date(parsed.lastUpdated) : undefined;
      return PreferencesSchema.parse(parsed);
    } catch {
      return PreferencesSchema.parse({});
    }
  }

  private savePreferences(): void {
    const dataToStore = {
      ...this.preferences,
      lastUpdated: new Date()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const validated = PreferencesSchema.partial().parse(updates);
    this.preferences = { ...this.preferences, ...validated };
    this.savePreferences();
  }

  resetToDefaults(): void {
    this.preferences = PreferencesSchema.parse({});
    localStorage.removeItem(STORAGE_KEY);
  }

  hasValidPreferences(): boolean {
    try {
      PreferencesSchema.parse(this.preferences);
      return true;
    } catch {
      return false;
    }
  }
}

export const preferencesManager = new UserPreferencesManager();