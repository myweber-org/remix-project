interface UserProfile {
  id: number;
  username: string;
  email: string;
  age?: number;
  isActive: boolean;
}

class UserProfileManager {
  private profiles: Map<number, UserProfile> = new Map();

  addProfile(profile: UserProfile): boolean {
    if (this.profiles.has(profile.id)) {
      return false;
    }
    
    if (!this.validateProfile(profile)) {
      return false;
    }
    
    this.profiles.set(profile.id, profile);
    return true;
  }

  updateProfile(id: number, updates: Partial<UserProfile>): boolean {
    const existingProfile = this.profiles.get(id);
    if (!existingProfile) {
      return false;
    }

    const updatedProfile = { ...existingProfile, ...updates };
    if (!this.validateProfile(updatedProfile)) {
      return false;
    }

    this.profiles.set(id, updatedProfile);
    return true;
  }

  getProfile(id: number): UserProfile | undefined {
    return this.profiles.get(id);
  }

  getAllProfiles(): UserProfile[] {
    return Array.from(this.profiles.values());
  }

  private validateProfile(profile: UserProfile): boolean {
    if (profile.username.trim().length < 3) {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      return false;
    }

    if (profile.age !== undefined && (profile.age < 0 || profile.age > 150)) {
      return false;
    }

    return true;
  }
}

export { UserProfile, UserProfileManager };