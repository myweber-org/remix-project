
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

  addProfile(profile: Omit<UserProfile, 'id'>): string {
    const id = this.generateId();
    const newProfile: UserProfile = {
      ...profile,
      id,
      lastLogin: new Date()
    };

    if (!this.validateProfile(newProfile)) {
      throw new Error('Invalid profile data');
    }

    this.profiles.set(id, newProfile);
    return id;
  }

  updateProfile(id: string, updates: Partial<UserProfile>): boolean {
    const profile = this.profiles.get(id);
    if (!profile) return false;

    const updatedProfile = { ...profile, ...updates };
    if (!this.validateProfile(updatedProfile)) {
      throw new Error('Invalid update data');
    }

    this.profiles.set(id, updatedProfile);
    return true;
  }

  getProfile(id: string): UserProfile | undefined {
    return this.profiles.get(id);
  }

  deactivateProfile(id: string): boolean {
    const profile = this.profiles.get(id);
    if (!profile) return false;

    profile.isActive = false;
    this.profiles.set(id, profile);
    return true;
  }

  getActiveProfiles(): UserProfile[] {
    return Array.from(this.profiles.values())
      .filter(profile => profile.isActive)
      .sort((a, b) => b.lastLogin.getTime() - a.lastLogin.getTime());
  }

  private validateProfile(profile: UserProfile): boolean {
    if (!profile.username || profile.username.length < 3) return false;
    if (!profile.email || !this.isValidEmail(profile.email)) return false;
    if (profile.age !== undefined && (profile.age < 0 || profile.age > 150)) return false;
    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

export { UserProfileManager, UserProfile };