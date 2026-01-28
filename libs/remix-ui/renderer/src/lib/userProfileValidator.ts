interface UserProfile {
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

class UserProfileValidator {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateAge(age: number): boolean {
    return age >= 18 && age <= 120;
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
      errors.push('Age must be between 18 and 120');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
}

const sampleProfile: UserProfile = {
  name: 'John Doe',
  email: 'john@example.com',
  age: 25,
  isActive: true
};

const validationResult = UserProfileValidator.validateProfile(sampleProfile);
console.log('Validation result:', validationResult);