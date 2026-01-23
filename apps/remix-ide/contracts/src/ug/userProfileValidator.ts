interface UserProfile {
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

class UserProfileValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MIN_AGE = 18;
  private static readonly MAX_AGE = 120;

  static validate(profile: UserProfile): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!profile.name || profile.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!this.EMAIL_REGEX.test(profile.email)) {
      errors.push('Invalid email format');
    }

    if (profile.age < this.MIN_AGE || profile.age > this.MAX_AGE) {
      errors.push(`Age must be between ${this.MIN_AGE} and ${this.MAX_AGE}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static createDefaultProfile(): UserProfile {
    return {
      name: '',
      email: '',
      age: 0,
      isActive: false
    };
  }
}

export { UserProfile, UserProfileValidator };