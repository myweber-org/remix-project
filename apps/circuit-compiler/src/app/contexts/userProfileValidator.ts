import { z } from 'zod';

const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']),
    notifications: z.boolean(),
    language: z.string().length(2)
  }).strict(),
  createdAt: z.date()
});

type UserProfile = z.infer<typeof UserProfileSchema>;

export class ProfileValidator {
  static validate(input: unknown): UserProfile {
    try {
      return UserProfileSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorDetails = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }));
        throw new ValidationError('Invalid user profile', errorDetails);
      }
      throw error;
    }
  }

  static validatePartial(updates: Partial<unknown>): Partial<UserProfile> {
    return UserProfileSchema.partial().parse(updates);
  }
}

class ValidationError extends Error {
  constructor(
    message: string,
    public readonly details: Array<{ path: string; message: string }>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function sanitizeProfile(profile: UserProfile): Omit<UserProfile, 'id' | 'createdAt'> {
  const { id, createdAt, ...sanitized } = profile;
  return sanitized;
}