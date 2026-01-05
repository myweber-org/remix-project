import { z } from 'zod';

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const userRegistrationSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: passwordSchema,
  confirmPassword: z.string(),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30),
  age: z.number().int().min(18, 'Must be at least 18 years old').optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export type UserRegistrationData = z.infer<typeof userRegistrationSchema>;

export class UserRegistrationValidator {
  static validate(data: unknown): { success: boolean; errors?: Record<string, string[]> } {
    const result = userRegistrationSchema.safeParse(data);
    
    if (!result.success) {
      const formattedErrors: Record<string, string[]> = {};
      
      result.error.errors.forEach(error => {
        const path = error.path.join('.');
        if (!formattedErrors[path]) {
          formattedErrors[path] = [];
        }
        formattedErrors[path].push(error.message);
      });
      
      return { success: false, errors: formattedErrors };
    }
    
    return { success: true };
  }

  static validatePassword(password: string): string[] {
    const result = passwordSchema.safeParse(password);
    return result.success ? [] : result.error.errors.map(err => err.message);
  }
}