interface UserRegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
}

class RegistrationValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MIN_PASSWORD_LENGTH = 8;

  static validate(data: UserRegistrationData): string[] {
    const errors: string[] = [];

    if (!this.isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }

    if (!this.isStrongPassword(data.password)) {
      errors.push(`Password must be at least ${this.MIN_PASSWORD_LENGTH} characters long`);
    }

    if (data.password !== data.confirmPassword) {
      errors.push('Passwords do not match');
    }

    return errors;
  }

  private static isValidEmail(email: string): boolean {
    return this.EMAIL_REGEX.test(email);
  }

  private static isStrongPassword(password: string): boolean {
    return password.length >= this.MIN_PASSWORD_LENGTH;
  }
}

export { UserRegistrationData, RegistrationValidator };