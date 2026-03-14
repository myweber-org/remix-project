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
  username: z.string().min(3, 'Username must be at least 3 characters').max(30),
  birthDate: z.string().refine((val) => {
    const date = new Date(val);
    const now = new Date();
    const minAgeDate = new Date(now.getFullYear() - 13, now.getMonth(), now.getDate());
    return date <= minAgeDate;
  }, 'User must be at least 13 years old')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export type UserRegistrationData = z.infer<typeof userRegistrationSchema>;

export function validateUserRegistration(data: unknown): { success: boolean; errors?: Record<string, string> } {
  const result = userRegistrationSchema.safeParse(data);
  
  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.errors.forEach((err) => {
      if (err.path.length > 0) {
        errors[err.path[0]] = err.message;
      }
    });
    return { success: false, errors };
  }
  
  return { success: true };
}

export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (password.length < 8) return 'weak';
  
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  
  const criteriaMet = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  
  if (criteriaMet >= 4) return 'strong';
  if (criteriaMet >= 3) return 'medium';
  return 'weak';
}