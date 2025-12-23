
interface UserProfile {
  id: string;
  username: string;
  email: string;
  age?: number;
  isActive: boolean;
  lastLogin: Date;
}

class UserProfileManager {
  private profiles: Map<string, UserProfile>;

  constructor() {
    this.profiles = new Map();
  }

  addProfile(profile: UserProfile): boolean {
    if (this.profiles.has(profile.id)) {
      console.error(`Profile with ID ${profile.id} already exists`);
      return false;
    }

    if (!this.validateEmail(profile.email)) {
      console.error(`Invalid email format: ${profile.email}`);
      return false;
    }

    if (profile.age !== undefined && (profile.age < 0 || profile.age > 150)) {
      console.error(`Invalid age value: ${profile.age}`);
      return false;
    }

    this.profiles.set(profile.id, profile);
    console.log(`Profile added successfully: ${profile.username}`);
    return true;
  }

  updateProfile(id: string, updates: Partial<UserProfile>): boolean {
    const existingProfile = this.profiles.get(id);
    if (!existingProfile) {
      console.error(`Profile with ID ${id} not found`);
      return false;
    }

    if (updates.email && !this.validateEmail(updates.email)) {
      console.error(`Invalid email format: ${updates.email}`);
      return false;
    }

    if (updates.age !== undefined && (updates.age < 0 || updates.age > 150)) {
      console.error(`Invalid age value: ${updates.age}`);
      return false;
    }

    const updatedProfile = { ...existingProfile, ...updates };
    this.profiles.set(id, updatedProfile);
    console.log(`Profile updated successfully: ${updatedProfile.username}`);
    return true;
  }

  getProfile(id: string): UserProfile | undefined {
    return this.profiles.get(id);
  }

  deactivateProfile(id: string): boolean {
    const profile = this.profiles.get(id);
    if (!profile) {
      console.error(`Profile with ID ${id} not found`);
      return false;
    }

    const updatedProfile = { ...profile, isActive: false };
    this.profiles.set(id, updatedProfile);
    console.log(`Profile deactivated: ${profile.username}`);
    return true;
  }

  listActiveProfiles(): UserProfile[] {
    return Array.from(this.profiles.values()).filter(profile => profile.isActive);
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export { UserProfileManager, UserProfile };