interface UserProfile {
  id: string;
  email: string;
  username: string;
  age?: number;
}

class UserProfileManager {
  private profiles: Map<string, UserProfile> = new Map();

  updateProfile(userId: string, updates: Partial<UserProfile>): { success: boolean; error?: string } {
    const profile = this.profiles.get(userId);
    
    if (!profile) {
      return { success: false, error: 'User profile not found' };
    }

    if (updates.email && !this.isValidEmail(updates.email)) {
      return { success: false, error: 'Invalid email format' };
    }

    if (updates.age !== undefined && (updates.age < 0 || updates.age > 150)) {
      return { success: false, error: 'Age must be between 0 and 150' };
    }

    const updatedProfile = { ...profile, ...updates };
    this.profiles.set(userId, updatedProfile);
    
    return { success: true };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  addProfile(profile: UserProfile): void {
    this.profiles.set(profile.id, profile);
  }

  getProfile(userId: string): UserProfile | undefined {
    return this.profiles.get(userId);
  }
}

const profileManager = new UserProfileManager();

profileManager.addProfile({
  id: 'user-123',
  email: 'john@example.com',
  username: 'john_doe',
  age: 25
});

const result = profileManager.updateProfile('user-123', {
  email: 'john.new@example.com',
  age: 26
});

console.log('Update result:', result);