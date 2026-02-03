typescript
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

class ProfileValidator {
    static validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validateUsername(username: string): boolean {
        return username.length >= 3 && username.length <= 30;
    }

    static validateAge(age: number): boolean {
        return age >= 0 && age <= 150;
    }
}

class UserProfileManager {
    private profiles: Map<string, UserProfile> = new Map();

    createProfile(profile: UserProfile): void {
        if (!ProfileValidator.validateEmail(profile.email)) {
            throw new Error('Invalid email format');
        }

        if (!ProfileValidator.validateUsername(profile.username)) {
            throw new Error('Username must be between 3 and 30 characters');
        }

        if (profile.age && !ProfileValidator.validateAge(profile.age)) {
            throw new Error('Age must be between 0 and 150');
        }

        this.profiles.set(profile.id, profile);
    }

    updateProfile(id: string, updates: Partial<UserProfile>): UserProfile | null {
        const existingProfile = this.profiles.get(id);
        if (!existingProfile) return null;

        const updatedProfile = { ...existingProfile, ...updates };

        if (updates.email && !ProfileValidator.validateEmail(updates.email)) {
            throw new Error('Invalid email format');
        }

        if (updates.username && !ProfileValidator.validateUsername(updates.username)) {
            throw new Error('Username must be between 3 and 30 characters');
        }

        if (updates.age !== undefined && !ProfileValidator.validateAge(updates.age)) {
            throw new Error('Age must be between 0 and 150');
        }

        this.profiles.set(id, updatedProfile);
        return updatedProfile;
    }

    getProfile(id: string): UserProfile | null {
        return this.profiles.get(id) || null;
    }

    getAllProfiles(): UserProfile[] {
        return Array.from(this.profiles.values());
    }

    deleteProfile(id: string): boolean {
        return this.profiles.delete(id);
    }
}

const profileManager = new UserProfileManager();

const sampleProfile: UserProfile = {
    id: 'user-001',
    username: 'john_doe',
    email: 'john@example.com',
    age: 25,
    preferences: {
        theme: 'dark',
        notifications: true
    }
};

try {
    profileManager.createProfile(sampleProfile);
    console.log('Profile created successfully');
    
    const updated = profileManager.updateProfile('user-001', { age: 26 });
    if (updated) {
        console.log('Profile updated:', updated);
    }
    
    const allProfiles = profileManager.getAllProfiles();
    console.log('Total profiles:', allProfiles.length);
} catch (error) {
    if (error instanceof Error) {
        console.error('Profile operation failed:', error.message);
    }
}
```