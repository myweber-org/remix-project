
interface UserProfile {
  id: number;
  username: string;
  email: string;
  age?: number;
  isActive: boolean;
}

const validateUserProfile = (profile: UserProfile): boolean => {
  if (!profile.username || profile.username.trim().length < 3) {
    console.error('Username must be at least 3 characters long');
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(profile.email)) {
    console.error('Invalid email format');
    return false;
  }

  if (profile.age !== undefined && (profile.age < 0 || profile.age > 150)) {
    console.error('Age must be between 0 and 150');
    return false;
  }

  return true;
};

const updateUserProfile = (
  currentProfile: UserProfile,
  updates: Partial<UserProfile>
): UserProfile | null => {
  const updatedProfile = { ...currentProfile, ...updates };

  if (!validateUserProfile(updatedProfile)) {
    return null;
  }

  console.log(`Profile updated for user ID: ${updatedProfile.id}`);
  return updatedProfile;
};

const logProfileDetails = (profile: UserProfile): void => {
  console.log(`User: ${profile.username}`);
  console.log(`Email: ${profile.email}`);
  console.log(`Status: ${profile.isActive ? 'Active' : 'Inactive'}`);
  if (profile.age) {
    console.log(`Age: ${profile.age}`);
  }
};

export { UserProfile, validateUserProfile, updateUserProfile, logProfileDetails };