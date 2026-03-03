import { z } from 'zod';

const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    notifications: z.boolean().default(true)
  }).default({}),
  createdAt: z.date().default(() => new Date())
});

type UserProfile = z.infer<typeof UserProfileSchema>;

function validateUserProfile(input: unknown): UserProfile {
  try {
    return UserProfileSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Validation failed:\n${errorMessages.join('\n')}`);
    }
    throw error;
  }
}

function createDefaultProfile(username: string, email: string): UserProfile {
  return UserProfileSchema.parse({
    username,
    email
  });
}

export { UserProfileSchema, validateUserProfile, createDefaultProfile, type UserProfile };import { z } from 'zod';

const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(20),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']),
    notifications: z.boolean().default(true),
  }),
  createdAt: z.date().default(() => new Date()),
});

type UserProfile = z.infer<typeof UserProfileSchema>;

function validateUserProfile(data: unknown): UserProfile {
  return UserProfileSchema.parse(data);
}

function safeValidateUserProfile(data: unknown) {
  return UserProfileSchema.safeParse(data);
}

export { UserProfileSchema, validateUserProfile, safeValidateUserProfile };
export type { UserProfile };
interface UserProfile {
  id: string;
  email: string;
  username: string;
  age?: number;
  bio?: string;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateUsername = (username: string): boolean => {
  return username.length >= 3 && username.length <= 30 && /^[a-zA-Z0-9_]+$/.test(username);
};

const validateAge = (age: number): boolean => {
  return age >= 13 && age <= 120;
};

const validateBio = (bio: string): boolean => {
  return bio.length <= 500;
};

export const validateUserProfile = (profile: Partial<UserProfile>): string[] => {
  const errors: string[] = [];

  if (profile.email !== undefined && !validateEmail(profile.email)) {
    errors.push('Invalid email format');
  }

  if (profile.username !== undefined && !validateUsername(profile.username)) {
    errors.push('Username must be 3-30 characters and contain only letters, numbers, and underscores');
  }

  if (profile.age !== undefined && !validateAge(profile.age)) {
    errors.push('Age must be between 13 and 120');
  }

  if (profile.bio !== undefined && !validateBio(profile.bio)) {
    errors.push('Bio cannot exceed 500 characters');
  }

  return errors;
};