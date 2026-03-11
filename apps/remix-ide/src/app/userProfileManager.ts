
interface UserProfile {
  id: string;
  username: string;
  email: string;
  age?: number;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

class UserProfileManager {
  private profiles: Map<string, UserProfile> = new Map();

  validateProfile(profile: Partial<UserProfile>): boolean {
    if (profile.username && profile.username.length < 3) {
      return false;
    }
    
    if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      return false;
    }
    
    if (profile.age && (profile.age < 0 || profile.age > 150)) {
      return false;
    }
    
    return true;
  }

  addProfile(profile: UserProfile): boolean {
    if (!this.validateProfile(profile) || this.profiles.has(profile.id)) {
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

  getProfilesByPreference(preference: keyof UserProfile['preferences'], value: any): UserProfile[] {
    return Array.from(this.profiles.values()).filter(
      profile => profile.preferences[preference] === value
    );
  }
}

const profileManager = new UserProfileManager();

const sampleProfile: UserProfile = {
  id: 'user-123',
  username: 'john_doe',
  email: 'john@example.com',
  age: 30,
  preferences: {
    theme: 'dark',
    notifications: true
  }
};

profileManager.addProfile(sampleProfile);

const updateSuccess = profileManager.updateProfile('user-123', {
  age: 31,
  preferences: {
    theme: 'light',
    notifications: false
  }
});

const darkThemeUsers = profileManager.getProfilesByPreference('theme', 'dark');