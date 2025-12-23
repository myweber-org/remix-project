
interface UserProfile {
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

class UserProfileValidator {
  private readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly MIN_AGE = 18;
  private readonly MAX_AGE = 120;

  validateEmail(email: string): boolean {
    return this.EMAIL_REGEX.test(email);
  }

  validateAge(age: number): boolean {
    return age >= this.MIN_AGE && age <= this.MAX_AGE;
  }

  validateProfile(profile: UserProfile): { isValid: boolean; errors: string[] } {
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
      errors: errors
    };
  }

  createValidProfile(name: string, email: string, age: number): UserProfile | null {
    const profile: UserProfile = {
      name: name,
      email: email,
      age: age,
      isActive: true
    };

    const validation = this.validateProfile(profile);
    
    if (validation.isValid) {
      return profile;
    }
    
    console.warn('Profile creation failed:', validation.errors);
    return null;
  }
}

const validator = new UserProfileValidator();

const testProfile = validator.createValidProfile(
  'John Doe',
  'john.doe@example.com',
  30
);

if (testProfile) {
  console.log('Valid profile created:', testProfile);
}