import { z } from 'zod';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  age?: number;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(30),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark']),
    notifications: z.boolean(),
  }),
});

export function validateUserProfile(data: unknown): UserProfile {
  const result = UserProfileSchema.safeParse(data);
  
  if (!result.success) {
    const errors = result.error.errors.map(err => 
      `${err.path.join('.')}: ${err.message}`
    ).join(', ');
    throw new Error(`Invalid user profile: ${errors}`);
  }
  
  return result.data;
}

export function createDefaultProfile(username: string, email: string): UserProfile {
  return {
    id: crypto.randomUUID(),
    username,
    email,
    preferences: {
      theme: 'light',
      notifications: true,
    },
  };
}