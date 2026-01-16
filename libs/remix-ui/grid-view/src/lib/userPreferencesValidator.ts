import { z } from "zod";

const ThemeSchema = z.enum(["light", "dark", "system"]);
const NotificationSettingsSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  frequency: z.enum(["immediate", "daily", "weekly"]).default("daily"),
});

export const UserPreferencesSchema = z.object({
  userId: z.string().uuid(),
  theme: ThemeSchema.default("system"),
  language: z.string().min(2).max(5).default("en"),
  notifications: NotificationSettingsSchema.default({
    email: true,
    push: false,
    frequency: "daily",
  }),
  createdAt: z.date().default(() => new Date()),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  return UserPreferencesSchema.parse(input);
}

export function safeValidateUserPreferences(input: unknown) {
  return UserPreferencesSchema.safeParse(input);
}