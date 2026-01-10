
interface UserRegistration {
  email: string;
  password: string;
  confirmPassword: string;
}

class RegistrationValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MIN_PASSWORD_LENGTH = 8;

  static validateEmail(email: string): string[] {
    const errors: string[] = [];
    
    if (!email) {
      errors.push('Email is required');
    } else if (!this.EMAIL_REGEX.test(email)) {
      errors.push('Invalid email format');
    }
    
    return errors;
  }

  static validatePassword(password: string, confirmPassword: string): string[] {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('Password is required');
    } else {
      if (password.length < this.MIN_PASSWORD_LENGTH) {
        errors.push(`Password must be at least ${this.MIN_PASSWORD_LENGTH} characters`);
      }
      
      if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      
      if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
      }
    }
    
    if (password !== confirmPassword) {
      errors.push('Passwords do not match');
    }
    
    return errors;
  }

  static validateRegistration(data: UserRegistration): Record<string, string[]> {
    const errors: Record<string, string[]> = {
      email: this.validateEmail(data.email),
      password: this.validatePassword(data.password, data.confirmPassword)
    };
    
    return errors;
  }

  static hasErrors(validationResult: Record<string, string[]>): boolean {
    return Object.values(validationResult).some(errors => errors.length > 0);
  }
}

export { UserRegistration, RegistrationValidator };