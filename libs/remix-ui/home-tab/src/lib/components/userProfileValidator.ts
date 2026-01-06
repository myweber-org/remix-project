interface UserProfile {
  email: string;
  age: number;
  username: string;
}

class UserProfileValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MIN_AGE = 13;
  private static readonly MAX_AGE = 120;

  static validate(profile: UserProfile): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.isValidEmail(profile.email)) {
      errors.push('Invalid email format');
    }

    if (!this.isValidAge(profile.age)) {
      errors.push(`Age must be between ${this.MIN_AGE} and ${this.MAX_AGE}`);
    }

    if (!this.isValidUsername(profile.username)) {
      errors.push('Username must be 3-20 alphanumeric characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private static isValidEmail(email: string): boolean {
    return this.EMAIL_REGEX.test(email);
  }

  private static isValidAge(age: number): boolean {
    return age >= this.MIN_AGE && age <= this.MAX_AGE;
  }

  private static isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  }
}

const testProfile: UserProfile = {
  email: 'test@example.com',
  age: 25,
  username: 'valid_user123'
};

const validationResult = UserProfileValidator.validate(testProfile);
console.log('Validation result:', validationResult);