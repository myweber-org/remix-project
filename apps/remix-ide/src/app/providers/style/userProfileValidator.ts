
interface UserProfile {
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

class ProfileValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MIN_AGE = 18;
  private static readonly MAX_AGE = 120;

  static validateEmail(email: string): boolean {
    return this.EMAIL_REGEX.test(email);
  }

  static validateAge(age: number): boolean {
    return age >= this.MIN_AGE && age <= this.MAX_AGE;
  }

  static validateProfile(profile: UserProfile): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!profile.name.trim()) {
      errors.push('Name is required');
    }

    if (!this.validateEmail(profile.email)) {
      errors.push('Invalid email format');
    }

    if (!this.validateAge(profile.age)) {
      errors.push(`Age must be between ${this.MIN_AGE} and ${this.MAX_AGE}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

const sampleProfile: UserProfile = {
  name: 'John Doe',
  email: 'john@example.com',
  age: 25,
  isActive: true
};

const validationResult = ProfileValidator.validateProfile(sampleProfile);
console.log('Profile validation:', validationResult);