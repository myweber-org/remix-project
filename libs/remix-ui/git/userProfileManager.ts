
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
      throw new Error(`Profile with id ${profile.id} already exists`);
    }

    if (!this.validateEmail(profile.email)) {
      throw new Error(`Invalid email format: ${profile.email}`);
    }

    if (profile.age !== undefined && profile.age < 0) {
      throw new Error(`Age cannot be negative: ${profile.age}`);
    }

    this.profiles.set(profile.id, { ...profile });
  }

  updateProfile(id: string, updates: Partial<UserProfile>): void {
    const profile = this.profiles.get(id);
    if (!profile) {
      throw new Error(`Profile with id ${id} not found`);
    }

    if (updates.email && !this.validateEmail(updates.email)) {
      throw new Error(`Invalid email format: ${updates.email}`);
    }

    if (updates.age !== undefined && updates.age < 0) {
      throw new Error(`Age cannot be negative: ${updates.age}`);
    }

    this.profiles.set(id, { ...profile, ...updates });
  }

  getProfile(id: string): UserProfile | undefined {
    return this.profiles.get(id);
  }

  getActiveUsers(): UserProfile[] {
    return Array.from(this.profiles.values())
      .filter(profile => profile.isActive)
      .sort((a, b) => b.lastLogin.getTime() - a.lastLogin.getTime());
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getProfileCount(): number {
    return this.profiles.size;
  }
}

const profileManager = new UserProfileManager();

const sampleProfile: UserProfile = {
  id: 'user-001',
  username: 'john_doe',
  email: 'john@example.com',
  age: 30,
  isActive: true,
  lastLogin: new Date()
};

try {
  profileManager.addProfile(sampleProfile);
  console.log(`Added profile: ${sampleProfile.username}`);
  
  profileManager.updateProfile('user-001', { age: 31 });
  console.log(`Updated profile age to 31`);
  
  const activeUsers = profileManager.getActiveUsers();
  console.log(`Active users: ${activeUsers.length}`);
  
  const profileCount = profileManager.getProfileCount();
  console.log(`Total profiles: ${profileCount}`);
} catch (error) {
  if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
  }
}