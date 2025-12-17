import { z } from "zod";

const ThemeSchema = z.enum(["light", "dark", "system"]);
const LanguageSchema = z.enum(["en", "es", "fr", "de"]);
const NotificationSettingsSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  frequency: z.enum(["instant", "daily", "weekly"]).optional(),
});

export const UserPreferencesSchema = z.object({
  userId: z.string().uuid(),
  theme: ThemeSchema.default("system"),
  language: LanguageSchema.default("en"),
  notifications: NotificationSettingsSchema.default({
    email: true,
    push: false,
  }),
  timezone: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  return UserPreferencesSchema.parse(input);
}

export function validatePartialPreferences(
  input: unknown
): Partial<UserPreferences> {
  return UserPreferencesSchema.partial().parse(input);
}