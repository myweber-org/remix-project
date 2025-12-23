
interface UserProfile {
  id: number;
  username: string;
  email: string;
  age?: number;
  isActive: boolean;
}

class UserProfileManager {
  private profiles: Map<number, UserProfile>;

  constructor() {
    this.profiles = new Map();
  }

  addProfile(profile: UserProfile): boolean {
    if (this.profiles.has(profile.id)) {
      console.error(`Profile with ID ${profile.id} already exists`);
      return false;
    }

    if (!this.validateProfile(profile)) {
      return false;
    }

    this.profiles.set(profile.id, profile);
    console.log(`Profile added for user: ${profile.username}`);
    return true;
  }

  updateProfile(id: number, updates: Partial<UserProfile>): boolean {
    const existingProfile = this.profiles.get(id);
    if (!existingProfile) {
      console.error(`Profile with ID ${id} not found`);
      return false;
    }

    const updatedProfile = { ...existingProfile, ...updates };
    if (!this.validateProfile(updatedProfile)) {
      return false;
    }

    this.profiles.set(id, updatedProfile);
    console.log(`Profile updated for user: ${updatedProfile.username}`);
    return true;
  }

  getProfile(id: number): UserProfile | undefined {
    return this.profiles.get(id);
  }

  getAllProfiles(): UserProfile[] {
    return Array.from(this.profiles.values());
  }

  removeProfile(id: number): boolean {
    const deleted = this.profiles.delete(id);
    if (deleted) {
      console.log(`Profile with ID ${id} removed`);
    }
    return deleted;
  }

  private validateProfile(profile: UserProfile): boolean {
    if (!profile.username || profile.username.trim().length === 0) {
      console.error('Username is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      console.error('Invalid email format');
      return false;
    }

    if (profile.age !== undefined && (profile.age < 0 || profile.age > 150)) {
      console.error('Age must be between 0 and 150');
      return false;
    }

    return true;
  }
}

export { UserProfileManager, UserProfile };