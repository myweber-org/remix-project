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
      throw new ValidationError('Invalid user ID');
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

function testValidation() {
  const validProfile: UserProfile = {
    id: 1,
    username: 'john_doe',
    email: 'john@example.com',
    age: 30,
    isActive: true
  };

  const invalidProfile: UserProfile = {
    id: 0,
    username: 'ab',
    email: 'invalid-email',
    age: 200,
    isActive: true
  };

  try {
    UserProfileValidator.validate(validProfile);
    console.log('Valid profile passed validation');
    
    UserProfileValidator.validate(invalidProfile);
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error('Validation failed:', error.message);
    }
  }
}

export { UserProfile, ValidationError, UserProfileValidator, testValidation };