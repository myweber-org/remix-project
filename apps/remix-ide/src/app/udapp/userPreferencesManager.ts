import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notificationsEnabled: z.boolean().default(true),
  fontSize: z.number().min(12).max(24).default(16),
  language: z.string().min(2).default('en'),
  autoSave: z.boolean().default(true),
  lastUpdated: z.date().optional()
});

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

const STORAGE_KEY = 'user_preferences';

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const result = UserPreferencesSchema.safeParse({
          ...parsed,
          lastUpdated: parsed.lastUpdated ? new Date(parsed.lastUpdated) : undefined
        });
        
        if (result.success) {
          return result.data;
        }
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage:', error);
    }
    
    return UserPreferencesSchema.parse({});
  }

  private savePreferences(): void {
    try {
      const dataToStore = {
        ...this.preferences,
        lastUpdated: new Date()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    try {
      const merged = { ...this.preferences, ...updates };
      const result = UserPreferencesSchema.safeParse(merged);
      
      if (result.success) {
        this.preferences = result.data;
        this.savePreferences();
        return true;
      }
      
      console.warn('Invalid preferences update:', result.error);
      return false;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      return false;
    }
  }

  resetToDefaults(): void {
    this.preferences = UserPreferencesSchema.parse({});
    this.savePreferences();
  }

  hasUnsavedChanges(): boolean {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    
    try {
      const parsed = JSON.parse(stored);
      return JSON.stringify(this.preferences) !== JSON.stringify(parsed);
    } catch {
      return true;
    }
  }
}

export const userPreferencesManager = new UserPreferencesManager();