
interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  age?: number;
  lastUpdated: Date;
}

class UserProfileManager {
  private profiles: Map<string, UserProfile> = new Map();
  private auditLog: string[] = [];

  updateProfile(userId: string, updates: Partial<Omit<UserProfile, 'id' | 'lastUpdated'>>): boolean {
    const existingProfile = this.profiles.get(userId);
    
    if (!existingProfile) {
      this.logAudit(`Update failed: User ${userId} not found`);
      return false;
    }

    if (updates.email && !this.isValidEmail(updates.email)) {
      this.logAudit(`Update failed: Invalid email for user ${userId}`);
      return false;
    }

    if (updates.age !== undefined && (updates.age < 0 || updates.age > 150)) {
      this.logAudit(`Update failed: Invalid age for user ${userId}`);
      return false;
    }

    const updatedProfile: UserProfile = {
      ...existingProfile,
      ...updates,
      lastUpdated: new Date()
    };

    this.profiles.set(userId, updatedProfile);
    this.logAudit(`Profile updated for user ${userId}`);
    return true;
  }

  getProfile(userId: string): UserProfile | undefined {
    return this.profiles.get(userId);
  }

  registerProfile(profile: Omit<UserProfile, 'lastUpdated'>): void {
    const newProfile: UserProfile = {
      ...profile,
      lastUpdated: new Date()
    };
    this.profiles.set(profile.id, newProfile);
    this.logAudit(`New profile registered for user ${profile.id}`);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private logAudit(message: string): void {
    const timestamp = new Date().toISOString();
    this.auditLog.push(`[${timestamp}] ${message}`);
  }

  getAuditLog(): string[] {
    return [...this.auditLog];
  }
}

const profileManager = new UserProfileManager();

profileManager.registerProfile({
  id: 'user-123',
  email: 'alice@example.com',
  displayName: 'Alice Smith'
});

const updateSuccess = profileManager.updateProfile('user-123', {
  displayName: 'Alice Johnson',
  age: 30
});

console.log(`Update successful: ${updateSuccess}`);
console.log(profileManager.getProfile('user-123'));
console.log(profileManager.getAuditLog());