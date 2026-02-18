typescript
interface UserProfile {
  id: string;
  username: string;
  email: string;
  age?: number;
  preferences: string[];
}

class UserProfileValidator {
  private static readonly USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MAX_PREFERENCES = 10;

  static validateProfile(profile: Partial<UserProfile>): string[] {
    const errors: string[] = [];

    if (profile.username !== undefined) {
      if (!this.USERNAME_REGEX.test(profile.username)) {
        errors.push('Username must be 3-20 characters and contain only letters, numbers, and underscores');
      }
    }

    if (profile.email !== undefined) {
      if (!this.EMAIL_REGEX.test(profile.email)) {
        errors.push('Invalid email format');
      }
    }

    if (profile.age !== undefined) {
      if (profile.age < 0 || profile.age > 150) {
        errors.push('Age must be between 0 and 150');
      }
    }

    if (profile.preferences !== undefined) {
      if (profile.preferences.length > this.MAX_PREFERENCES) {
        errors.push(`Cannot have more than ${this.MAX_PREFERENCES} preferences`);
      }
      if (profile.preferences.some(pref => pref.trim().length === 0)) {
        errors.push('Preferences cannot contain empty strings');
      }
    }

    return errors;
  }

  static validateForUpdate(profile: Partial<UserProfile>): { isValid: boolean; errors: string[] } {
    const errors = this.validateProfile(profile);
    
    if (Object.keys(profile).length === 0) {
      errors.push('No fields provided for update');
    }

    if (profile.id !== undefined) {
      errors.push('Cannot update user ID');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export { UserProfile, UserProfileValidator };
```