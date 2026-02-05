
interface UserProfile {
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

class UserProfileValidator {
  private readonly MIN_AGE = 13;
  private readonly MAX_AGE = 120;
  private readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  validate(profile: UserProfile): ValidationResult {
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

  sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  calculateBirthYear(age: number): number {
    const currentYear = new Date().getFullYear();
    return currentYear - age;
  }
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

function createSampleProfile(): UserProfile {
  return {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    isActive: true
  };
}

const validator = new UserProfileValidator();
const sampleProfile = createSampleProfile();
const validationResult = validator.validate(sampleProfile);

console.log('Profile validation result:', validationResult);
console.log('Sanitized email:', validator.sanitizeEmail(sampleProfile.email));
console.log('Estimated birth year:', validator.calculateBirthYear(sampleProfile.age));