import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  isActive: boolean;
}

class UserRegistrationService {
  private readonly emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly minPasswordLength: number = 8;

  validateUsername(username: string): boolean {
    return username.length >= 3 && username.length <= 30;
  }

  validateEmail(email: string): boolean {
    return this.emailRegex.test(email);
  }

  validatePassword(password: string): boolean {
    return password.length >= this.minPasswordLength && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /\d/.test(password);
  }

  async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async registerUser(username: string, email: string, password: string): Promise<User> {
    if (!this.validateUsername(username)) {
      throw new Error('Invalid username');
    }

    if (!this.validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (!this.validatePassword(password)) {
      throw new Error('Password does not meet security requirements');
    }

    const passwordHash = await this.hashPassword(password);
    
    const newUser: User = {
      id: uuidv4(),
      username,
      email,
      passwordHash,
      createdAt: new Date(),
      isActive: true
    };

    await this.persistUser(newUser);
    return newUser;
  }

  private async persistUser(user: User): Promise<void> {
    console.log(`Persisting user ${user.username} to database`);
  }
}

export { UserRegistrationService, User };