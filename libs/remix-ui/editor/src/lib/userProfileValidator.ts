
interface UserProfile {
  name: string;
  email: string;
  age: number;
}

class UserProfileValidator {
  private readonly MIN_AGE = 18;
  private readonly MAX_AGE = 120;
  private readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  validate(profile: UserProfile): { isValid: boolean; errors: string[] } {
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
      errors: errors
    };
  }

  validateMultiple(profiles: UserProfile[]): { valid: UserProfile[]; invalid: UserProfile[] } {
    const valid: UserProfile[] = [];
    const invalid: UserProfile[] = [];

    profiles.forEach(profile => {
      const result = this.validate(profile);
      if (result.isValid) {
        valid.push(profile);
      } else {
        invalid.push(profile);
      }
    });

    return { valid, invalid };
  }
}

export { UserProfile, UserProfileValidator };