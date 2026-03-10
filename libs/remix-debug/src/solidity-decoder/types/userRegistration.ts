import { z } from 'zod';

interface UserProfile {
  email: string;
  username: string;
  age: number;
  isActive: boolean;
}

const UserRegistrationSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  age: z.number().int().positive('Age must be a positive integer'),
  isActive: z.boolean().default(true),
  preferences: z.object({
    newsletter: z.boolean().default(false),
    theme: z.enum(['light', 'dark']).default('light'),
  }).optional(),
});

type ValidatedUser = z.infer<typeof UserRegistrationSchema>;

function validateUserRegistration(data: unknown): ValidatedUser | null {
  const result = UserRegistrationSchema.safeParse(data);
  
  if (!result.success) {
    console.error('Validation failed:', result.error.errors);
    return null;
  }
  
  return result.data;
}

function createUserProfile(userData: ValidatedUser): UserProfile {
  return {
    email: userData.email,
    username: userData.username,
    age: userData.age,
    isActive: userData.isActive,
  };
}

const sampleInput = {
  email: 'test@example.com',
  username: 'john_doe',
  age: 25,
  isActive: true,
  preferences: {
    newsletter: true,
    theme: 'dark' as const,
  },
};

const validatedUser = validateUserRegistration(sampleInput);

if (validatedUser) {
  const userProfile = createUserProfile(validatedUser);
  console.log('User profile created:', userProfile);
}