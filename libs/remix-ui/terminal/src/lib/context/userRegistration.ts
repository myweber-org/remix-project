interface UserRegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
}

class RegistrationValidator {
  private readonly MIN_PASSWORD_LENGTH = 8;
  private readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  validateEmail(email: string): { isValid: boolean; message?: string } {
    if (!email.trim()) {
      return { isValid: false, message: 'Email is required' };
    }
    
    if (!this.EMAIL_REGEX.test(email)) {
      return { isValid: false, message: 'Invalid email format' };
    }
    
    return { isValid: true };
  }

  validatePassword(password: string): { isValid: boolean; message?: string } {
    if (!password) {
      return { isValid: false, message: 'Password is required' };
    }
    
    if (password.length < this.MIN_PASSWORD_LENGTH) {
      return { 
        isValid: false, 
        message: `Password must be at least ${this.MIN_PASSWORD_LENGTH} characters long` 
      };
    }
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return {
        isValid: false,
        message: 'Password must contain uppercase, lowercase, numbers, and special characters'
      };
    }
    
    return { isValid: true };
  }

  validateRegistration(data: UserRegistrationData): { 
    isValid: boolean; 
    errors: string[] 
  } {
    const errors: string[] = [];
    
    const emailValidation = this.validateEmail(data.email);
    if (!emailValidation.isValid && emailValidation.message) {
      errors.push(emailValidation.message);
    }
    
    const passwordValidation = this.validatePassword(data.password);
    if (!passwordValidation.isValid && passwordValidation.message) {
      errors.push(passwordValidation.message);
    }
    
    if (data.password !== data.confirmPassword) {
      errors.push('Passwords do not match');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export { RegistrationValidator, UserRegistrationData };