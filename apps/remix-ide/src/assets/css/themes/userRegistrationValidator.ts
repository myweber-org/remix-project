interface RegistrationData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

class RegistrationValidator {
  private readonly emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly passwordMinLength: number = 8;

  validate(data: RegistrationData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.username.trim()) {
      errors.push('Username is required');
    }

    if (!this.isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }

    if (!this.isStrongPassword(data.password)) {
      errors.push(`Password must be at least ${this.passwordMinLength} characters long and contain uppercase, lowercase, number, and special character`);
    }

    if (data.password !== data.confirmPassword) {
      errors.push('Passwords do not match');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private isValidEmail(email: string): boolean {
    return this.emailRegex.test(email);
  }

  private isStrongPassword(password: string): boolean {
    if (password.length < this.passwordMinLength) return false;
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  }
}

export { RegistrationValidator, RegistrationData };