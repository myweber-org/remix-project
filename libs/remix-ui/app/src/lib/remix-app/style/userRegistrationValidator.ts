import { z } from 'zod';

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const userRegistrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  confirmPassword: z.string(),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  age: z.number().int().min(18, 'Must be at least 18 years old').optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export type UserRegistrationData = z.infer<typeof userRegistrationSchema>;

export function validateUserRegistration(data: unknown): {
  success: boolean;
  data?: UserRegistrationData;
  errors?: Record<string, string>;
} {
  const result = userRegistrationSchema.safeParse(data);
  
  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.errors.forEach(error => {
      const path = error.path.join('.');
      errors[path] = error.message;
    });
    return { success: false, errors };
  }
  
  return { success: true, data: result.data };
}

export function validatePasswordStrength(password: string): string[] {
  const requirements = [
    { test: (p: string) => p.length >= 8, message: 'At least 8 characters' },
    { test: (p: string) => /[A-Z]/.test(p), message: 'One uppercase letter' },
    { test: (p: string) => /[a-z]/.test(p), message: 'One lowercase letter' },
    { test: (p: string) => /[0-9]/.test(p), message: 'One number' },
    { test: (p: string) => /[^A-Za-z0-9]/.test(p), message: 'One special character' }
  ];
  
  return requirements
    .filter(req => !req.test(password))
    .map(req => req.message);
}