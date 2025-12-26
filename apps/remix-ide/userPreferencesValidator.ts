import { z } from "zod";

export const UserPreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system"),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(["instant", "daily", "weekly"]).default("daily")
  }),
  privacy: z.object({
    profileVisibility: z.enum(["public", "friends", "private"]).default("friends"),
    searchIndexing: z.boolean().default(true)
  }),
  language: z.string().min(2).max(5).default("en")
}).strict();

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = error.issues.map(issue => ({
          path: issue.path.join("."),
          message: issue.message
        }));
        throw new Error(`Invalid preferences: ${JSON.stringify(issues)}`);
      }
      throw new Error("Unknown validation error");
    }
  }

  static getDefaultPreferences(): UserPreferences {
    return UserPreferencesSchema.parse({});
  }

  static mergeWithDefaults(partial: Partial<UserPreferences>): UserPreferences {
    const defaults = this.getDefaultPreferences();
    return this.validate({ ...defaults, ...partial });
  }
}