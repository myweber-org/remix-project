interface UserProfile {
  id: string;
  username: string;
  email: string;
  age?: number;
  isActive: boolean;
}

class UserProfileManager {
  private profiles: Map<string, UserProfile> = new Map();

  validateProfile(profile: UserProfile): string[] {
    const errors: string[] = [];
    
    if (!profile.username || profile.username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!profile.email || !emailRegex.test(profile.email)) {
      errors.push('Invalid email format');
    }
    
    if (profile.age !== undefined && (profile.age < 0 || profile.age > 150)) {
      errors.push('Age must be between 0 and 150');
    }
    
    return errors;
  }

  addProfile(profile: UserProfile): boolean {
    const errors = this.validateProfile(profile);
    if (errors.length > 0) {
      console.error('Profile validation failed:', errors);
      return false;
    }
    
    if (this.profiles.has(profile.id)) {
      console.error(`Profile with id ${profile.id} already exists`);
      return false;
    }
    
    this.profiles.set(profile.id, profile);
    console.log(`Profile added successfully: ${profile.username}`);
    return true;
  }

  updateProfile(id: string, updates: Partial<UserProfile>): boolean {
    const existingProfile = this.profiles.get(id);
    if (!existingProfile) {
      console.error(`Profile with id ${id} not found`);
      return false;
    }
    
    const updatedProfile: UserProfile = { ...existingProfile, ...updates };
    const errors = this.validateProfile(updatedProfile);
    if (errors.length > 0) {
      console.error('Profile update validation failed:', errors);
      return false;
    }
    
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
      console.error(`Profile with id ${id} not found`);
      return false;
    }
    
    return this.updateProfile(id, { isActive: false });
  }

  listActiveProfiles(): UserProfile[] {
    return Array.from(this.profiles.values())
      .filter(profile => profile.isActive)
      .sort((a, b) => a.username.localeCompare(b.username));
  }
}

const profileManager = new UserProfileManager();

const sampleProfile: UserProfile = {
  id: 'user-001',
  username: 'john_doe',
  email: 'john@example.com',
  age: 30,
  isActive: true
};

profileManager.addProfile(sampleProfile);
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

    if (!this.isValidEmail(profile.email)) {
      throw new Error(`Invalid email format: ${profile.email}`);
    }

    if (profile.age !== undefined && (profile.age < 0 || profile.age > 150)) {
      throw new Error(`Invalid age value: ${profile.age}`);
    }

    this.profiles.set(profile.id, profile);
  }

  updateProfile(id: string, updates: Partial<Omit<UserProfile, 'id'>>): UserProfile | null {
    const existingProfile = this.profiles.get(id);
    if (!existingProfile) {
      return null;
    }

    const updatedProfile: UserProfile = {
      ...existingProfile,
      ...updates,
      id: existingProfile.id
    };

    if (updates.email && !this.isValidEmail(updatedProfile.email)) {
      throw new Error(`Invalid email format: ${updatedProfile.email}`);
    }

    if (updates.age !== undefined && (updatedProfile.age < 0 || updatedProfile.age > 150)) {
      throw new Error(`Invalid age value: ${updatedProfile.age}`);
    }

    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }

  getProfile(id: string): UserProfile | null {
    return this.profiles.get(id) || null;
  }

  getActiveUsers(): UserProfile[] {
    return Array.from(this.profiles.values())
      .filter(profile => profile.isActive)
      .sort((a, b) => b.lastLogin.getTime() - a.lastLogin.getTime());
  }

  deactivateInactiveUsers(maxInactiveDays: number): string[] {
    const deactivatedIds: string[] = [];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - maxInactiveDays);

    this.profiles.forEach((profile, id) => {
      if (profile.isActive && profile.lastLogin < cutoffDate) {
        profile.isActive = false;
        deactivatedIds.push(id);
      }
    });

    return deactivatedIds;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export { UserProfileManager, UserProfile };