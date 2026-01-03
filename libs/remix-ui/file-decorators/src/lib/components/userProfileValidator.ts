
interface UserProfile {
  id: number;
  username: string;
  email: string;
  age?: number;
  isActive: boolean;
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class UserProfileValidator {
  static validate(profile: UserProfile): void {
    if (!profile.id || profile.id <= 0) {
      throw new ValidationError('ID must be a positive integer');
    }

    if (!profile.username || profile.username.trim().length < 3) {
      throw new ValidationError('Username must be at least 3 characters long');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!profile.email || !emailRegex.test(profile.email)) {
      throw new ValidationError('Invalid email format');
    }

    if (profile.age !== undefined && (profile.age < 0 || profile.age > 150)) {
      throw new ValidationError('Age must be between 0 and 150');
    }

    if (typeof profile.isActive !== 'boolean') {
      throw new ValidationError('isActive must be a boolean value');
    }
  }
}

function validateUserProfile(profileData: any): UserProfile {
  const profile: UserProfile = {
    id: profileData.id,
    username: profileData.username,
    email: profileData.email,
    age: profileData.age,
    isActive: profileData.isActive
  };

  UserProfileValidator.validate(profile);
  return profile;
}

export { UserProfile, UserProfileValidator, validateUserProfile, ValidationError };