import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.boolean().default(true),
  fontSize: z.number().min(12).max(24).default(16),
  language: z.string().min(2).default('en'),
});

type UserPreferences = z.infer<typeof PreferenceSchema>;

class PreferencesManager {
  private static STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(PreferencesManager.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return PreferenceSchema.parse(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences, using defaults:', error);
    }
    return PreferenceSchema.parse({});
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const merged = { ...this.preferences, ...updates };
    const validated = PreferenceSchema.parse(merged);
    
    this.preferences = validated;
    this.savePreferences();
  }

  private savePreferences(): void {
    localStorage.setItem(
      PreferencesManager.STORAGE_KEY,
      JSON.stringify(this.preferences)
    );
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = PreferenceSchema.parse({});
    this.savePreferences();
  }
}

export const preferencesManager = new PreferencesManager();