interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    frequency: 'instant' | 'daily' | 'weekly';
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    searchIndexing: boolean;
  };
}

function validatePreferences(prefs: UserPreferences): boolean {
  const validThemes = ['light', 'dark', 'auto'];
  const validFrequencies = ['instant', 'daily', 'weekly'];
  const validVisibilities = ['public', 'private', 'friends'];

  if (!validThemes.includes(prefs.theme)) {
    return false;
  }

  if (!validFrequencies.includes(prefs.notifications.frequency)) {
    return false;
  }

  if (!validVisibilities.includes(prefs.privacy.profileVisibility)) {
    return false;
  }

  if (typeof prefs.notifications.email !== 'boolean' || 
      typeof prefs.notifications.push !== 'boolean' ||
      typeof prefs.privacy.searchIndexing !== 'boolean') {
    return false;
  }

  return true;
}

function getDefaultPreferences(): UserPreferences {
  return {
    theme: 'auto',
    notifications: {
      email: true,
      push: false,
      frequency: 'daily'
    },
    privacy: {
      profileVisibility: 'friends',
      searchIndexing: true
    }
  };
}

export { UserPreferences, validatePreferences, getDefaultPreferences };