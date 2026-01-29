
interface UserProfile {
  id: string;
  email: string;
  username: string;
  age?: number;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

class UserProfileManager {
  private profiles: Map<string, UserProfile> = new Map();

  validateProfile(profile: Partial<UserProfile>): string[] {
    const errors: string[] = [];

    if (profile.email && !this.isValidEmail(profile.email)) {
      errors.push('Invalid email format');
    }

    if (profile.username) {
      if (profile.username.length < 3) {
        errors.push('Username must be at least 3 characters long');
      }
      if (!/^[a-zA-Z0-9_]+$/.test(profile.username)) {
        errors.push('Username can only contain letters, numbers, and underscores');
      }
    }

    if (profile.age !== undefined && (profile.age < 0 || profile.age > 150)) {
      errors.push('Age must be between 0 and 150');
    }

    if (profile.preferences?.theme && !['light', 'dark'].includes(profile.preferences.theme)) {
      errors.push('Theme must be either light or dark');
    }

    return errors;
  }

  updateProfile(userId: string, updates: Partial<UserProfile>): { success: boolean; errors?: string[] } {
    const existingProfile = this.profiles.get(userId);
    
    if (!existingProfile) {
      return { 
        success: false, 
        errors: ['User profile not found'] 
      };
    }

    const validationErrors = this.validateProfile(updates);
    
    if (validationErrors.length > 0) {
      return { 
        success: false, 
        errors: validationErrors 
      };
    }

    const updatedProfile: UserProfile = {
      ...existingProfile,
      ...updates,
      preferences: {
        ...existingProfile.preferences,
        ...updates.preferences
      }
    };

    this.profiles.set(userId, updatedProfile);
    return { success: true };
  }

  getProfile(userId: string): UserProfile | undefined {
    return this.profiles.get(userId);
  }

  registerProfile(profile: Omit<UserProfile, 'id'>): { success: boolean; profile?: UserProfile; errors?: string[] } {
    const userId = this.generateUserId();
    const newProfile: UserProfile = {
      ...profile,
      id: userId
    };

    const validationErrors = this.validateProfile(newProfile);
    
    if (validationErrors.length > 0) {
      return { 
        success: false, 
        errors: validationErrors 
      };
    }

    this.profiles.set(userId, newProfile);
    return { 
      success: true, 
      profile: newProfile 
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export { UserProfileManager, UserProfile };