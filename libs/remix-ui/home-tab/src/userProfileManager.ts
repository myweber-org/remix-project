
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

    if (!this.validateProfile(profile)) {
      return false;
    }

    this.profiles.set(profile.id, profile);
    return true;
  }

  updateProfile(id: string, updates: Partial<UserProfile>): boolean {
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

  getProfile(id: string): UserProfile | undefined {
    return this.profiles.get(id);
  }

  deactivateProfile(id: string): boolean {
    const profile = this.profiles.get(id);
    if (!profile) {
      return false;
    }

    return this.updateProfile(id, { isActive: false });
  }

  private validateProfile(profile: UserProfile): boolean {
    if (!profile.id || profile.id.trim() === '') {
      return false;
    }

    if (!profile.username || profile.username.trim() === '') {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!profile.email || !emailRegex.test(profile.email)) {
      return false;
    }

    if (profile.age !== undefined && (profile.age < 0 || profile.age > 150)) {
      return false;
    }

    return true;
  }

  getActiveProfiles(): UserProfile[] {
    return Array.from(this.profiles.values()).filter(profile => profile.isActive);
  }

  getProfileCount(): number {
    return this.profiles.size;
  }
}

const profileManager = new UserProfileManager();

const sampleProfile: UserProfile = {
  id: 'user-123',
  username: 'john_doe',
  email: 'john@example.com',
  age: 30,
  isActive: true
};

profileManager.addProfile(sampleProfile);

const updateResult = profileManager.updateProfile('user-123', { age: 31 });
console.log(`Update successful: ${updateResult}`);

const retrievedProfile = profileManager.getProfile('user-123');
console.log(`Retrieved profile: ${JSON.stringify(retrievedProfile)}`);

const activeProfiles = profileManager.getActiveProfiles();
console.log(`Active profiles: ${activeProfiles.length}`);