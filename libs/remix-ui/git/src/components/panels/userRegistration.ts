import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
}

class UserRegistrationService {
  private registeredEmails: Set<string> = new Set();
  private registeredUsernames: Set<string> = new Set();

  async registerUser(email: string, username: string, password: string): Promise<User> {
    this.validateInput(email, username, password);

    if (this.registeredEmails.has(email)) {
      throw new Error('Email already registered');
    }

    if (this.registeredUsernames.has(username)) {
      throw new Error('Username already taken');
    }

    const passwordHash = await this.hashPassword(password);
    const user: User = {
      id: uuidv4(),
      email: email.toLowerCase().trim(),
      username: username.trim(),
      passwordHash,
      createdAt: new Date()
    };

    this.registeredEmails.add(user.email);
    this.registeredUsernames.add(user.username);

    console.log(`User ${user.username} registered successfully with ID: ${user.id}`);
    return user;
  }

  private validateInput(email: string, username: string, password: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    if (username.length < 3 || username.length > 20) {
      throw new Error('Username must be between 3 and 20 characters');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

export default UserRegistrationService;