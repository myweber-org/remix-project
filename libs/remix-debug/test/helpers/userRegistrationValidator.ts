interface UserRegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
}

class RegistrationValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MIN_PASSWORD_LENGTH = 8;

  static validateEmail(email: string): string | null {
    if (!email.trim()) {
      return 'Email is required';
    }
    if (!this.EMAIL_REGEX.test(email)) {
      return 'Invalid email format';
    }
    return null;
  }

  static validatePassword(password: string): string | null {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < this.MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${this.MIN_PASSWORD_LENGTH} characters`;
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  }

  static validateConfirmPassword(password: string, confirmPassword: string): string | null {
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  }

  static validateRegistration(data: UserRegistrationData): Record<string, string> {
    const errors: Record<string, string> = {};
    
    const emailError = this.validateEmail(data.email);
    if (emailError) errors.email = emailError;
    
    const passwordError = this.validatePassword(data.password);
    if (passwordError) errors.password = passwordError;
    
    const confirmError = this.validateConfirmPassword(data.password, data.confirmPassword);
    if (confirmError) errors.confirmPassword = confirmError;
    
    return errors;
  }
}

export { RegistrationValidator, UserRegistrationData };