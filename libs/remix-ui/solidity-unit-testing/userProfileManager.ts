
interface UserProfile {
  id: string;
  username: string;
  email: string;
  age?: number;
  isActive: boolean;
}

class UserProfileManager {
  private profiles: Map<string, UserProfile>;

  constructor() {
    this.profiles = new Map();
  }

  addProfile(profile: UserProfile): boolean {
    if (this.profiles.has(profile.id)) {
      return false;
    }

    if (!this.validateEmail(profile.email)) {
      throw new Error('Invalid email format');
    }

    if (profile.age && profile.age < 0) {
      throw new Error('Age cannot be negative');
    }

    this.profiles.set(profile.id, profile);
    return true;
  }

  updateProfile(id: string, updates: Partial<UserProfile>): boolean {
    const existingProfile = this.profiles.get(id);
    if (!existingProfile) {
      return false;
    }

    if (updates.email && !this.validateEmail(updates.email)) {
      throw new Error('Invalid email format');
    }

    if (updates.age && updates.age < 0) {
      throw new Error('Age cannot be negative');
    }

    const updatedProfile = { ...existingProfile, ...updates };
    this.profiles.set(id, updatedProfile);
    return true;
  }

  getProfile(id: string): UserProfile | undefined {
    return this.profiles.get(id);
  }

  getActiveProfiles(): UserProfile[] {
    return Array.from(this.profiles.values())
      .filter(profile => profile.isActive);
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export { UserProfileManager, UserProfile };