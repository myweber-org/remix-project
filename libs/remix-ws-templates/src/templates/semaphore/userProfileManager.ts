
interface UserProfile {
  id: string;
  username: string;
  email: string;
  age?: number;
  isActive: boolean;
  lastLogin: Date;
}

class UserProfileManager {
  private profiles: Map<string, UserProfile> = new Map();

  addProfile(profile: UserProfile): void {
    if (this.profiles.has(profile.id)) {
      throw new Error(`Profile with ID ${profile.id} already exists`);
    }

    if (!this.validateEmail(profile.email)) {
      throw new Error('Invalid email format');
    }

    if (profile.age !== undefined && profile.age < 0) {
      throw new Error('Age cannot be negative');
    }

    this.profiles.set(profile.id, profile);
  }

  updateProfile(id: string, updates: Partial<UserProfile>): UserProfile {
    const profile = this.profiles.get(id);
    if (!profile) {
      throw new Error(`Profile with ID ${id} not found`);
    }

    const updatedProfile = { ...profile, ...updates };

    if (updates.email && !this.validateEmail(updatedProfile.email)) {
      throw new Error('Invalid email format');
    }

    if (updates.age !== undefined && updatedProfile.age < 0) {
      throw new Error('Age cannot be negative');
    }

    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }

  getProfile(id: string): UserProfile | undefined {
    return this.profiles.get(id);
  }

  getActiveUsers(): UserProfile[] {
    return Array.from(this.profiles.values())
      .filter(profile => profile.isActive)
      .sort((a, b) => b.lastLogin.getTime() - a.lastLogin.getTime());
  }

  deactivateInactiveUsers(daysThreshold: number): string[] {
    const deactivatedIds: string[] = [];
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);

    this.profiles.forEach((profile, id) => {
      if (profile.isActive && profile.lastLogin < thresholdDate) {
        profile.isActive = false;
        deactivatedIds.push(id);
      }
    });

    return deactivatedIds;
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export { UserProfileManager, UserProfile };