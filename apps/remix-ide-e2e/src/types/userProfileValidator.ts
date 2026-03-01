
interface UserProfile {
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

class UserProfileValidator {
  private static readonly MIN_AGE = 18;
  private static readonly MAX_AGE = 120;
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  static validate(profile: UserProfile): ValidationResult {
    const errors: string[] = [];

    if (!profile.name.trim()) {
      errors.push('Name cannot be empty');
    }

    if (!this.EMAIL_REGEX.test(profile.email)) {
      errors.push('Invalid email format');
    }

    if (profile.age < this.MIN_AGE || profile.age > this.MAX_AGE) {
      errors.push(`Age must be between ${this.MIN_AGE} and ${this.MAX_AGE}`);
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  static createDefaultProfile(): UserProfile {
    return {
      name: '',
      email: '',
      age: this.MIN_AGE,
      isActive: true
    };
  }
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

function demonstrateValidation() {
  const testProfile = UserProfileValidator.createDefaultProfile();
  testProfile.name = 'John Doe';
  testProfile.email = 'john@example.com';
  testProfile.age = 25;

  const result = UserProfileValidator.validate(testProfile);
  
  console.log('Validation result:', result.isValid);
  if (!result.isValid) {
    console.log('Errors:', result.errors);
  }
}

export { UserProfile, UserProfileValidator, ValidationResult };