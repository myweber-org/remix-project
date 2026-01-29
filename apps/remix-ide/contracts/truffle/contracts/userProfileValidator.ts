import { z } from 'zod';

const UserProfileSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    notifications: z.boolean().default(true)
  }).default({}),
  tags: z.array(z.string()).max(10)
});

type UserProfile = z.infer<typeof UserProfileSchema>;

export function validateUserProfile(data: unknown): UserProfile {
  return UserProfileSchema.parse(data);
}

export function safeValidateUserProfile(data: unknown) {
  return UserProfileSchema.safeParse(data);
}import { z } from "zod";

export const UserProfileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z
    .string()
    .email("Invalid email address"),
  age: z
    .number()
    .int("Age must be an integer")
    .min(18, "Must be at least 18 years old")
    .max(120, "Age must be realistic"),
  preferences: z.object({
    newsletter: z.boolean(),
    theme: z.enum(["light", "dark", "auto"]),
    notifications: z.boolean()
  }),
  tags: z
    .array(z.string())
    .min(1, "At least one tag is required")
    .max(5, "Cannot have more than 5 tags")
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

export function validateUserProfile(data: unknown): UserProfile {
  return UserProfileSchema.parse(data);
}

export function safeValidateUserProfile(data: unknown) {
  return UserProfileSchema.safeParse(data);
}