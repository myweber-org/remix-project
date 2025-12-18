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

  updateProfile(id: string, updates: Partial<UserProfile>): boolean {
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

  getProfile(id: string): UserProfile | undefined {
    return this.profiles.get(id);
  }

  getAllProfiles(): UserProfile[] {
    return Array.from(this.profiles.values());
  }

  deactivateProfile(id: string): boolean {
    const profile = this.profiles.get(id);
    if (!profile) {
      console.error(`Profile with ID ${id} not found`);
      return false;
    }

    profile.isActive = false;
    this.profiles.set(id, profile);
    console.log(`Profile deactivated for user: ${profile.username}`);
    return true;
  }

  private validateProfile(profile: UserProfile): boolean {
    if (!profile.id || profile.id.trim() === '') {
      console.error('Profile ID is required');
      return false;
    }

    if (!profile.username || profile.username.trim() === '') {
      console.error('Username is required');
      return false;
    }

    if (!profile.email || !this.isValidEmail(profile.email)) {
      console.error('Valid email is required');
      return false;
    }

    if (profile.age !== undefined && (profile.age < 0 || profile.age > 150)) {
      console.error('Age must be between 0 and 150');
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

const updated = profileManager.updateProfile('user-123', { age: 31 });
console.log(`Update successful: ${updated}`);

const retrievedProfile = profileManager.getProfile('user-123');
console.log('Retrieved profile:', retrievedProfile);