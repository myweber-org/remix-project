interface UserProfile {
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

class UserProfileValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MIN_AGE = 13;
  private static readonly MAX_AGE = 120;

  static validate(profile: UserProfile): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!profile.name || profile.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!UserProfileValidator.EMAIL_REGEX.test(profile.email)) {
      errors.push('Invalid email format');
    }

    if (profile.age < UserProfileValidator.MIN_AGE || profile.age > UserProfileValidator.MAX_AGE) {
      errors.push(`Age must be between ${UserProfileValidator.MIN_AGE} and ${UserProfileValidator.MAX_AGE}`);
    }

    if (typeof profile.isActive !== 'boolean') {
      errors.push('Active status must be a boolean value');
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