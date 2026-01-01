import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

class UserRegistrationService {
  private readonly users: Map<string, User> = new Map();
  private readonly SALT_ROUNDS = 10;

  async registerUser(username: string, email: string, password: string): Promise<User> {
    this.validateInput(username, email, password);

    const existingUser = Array.from(this.users.values()).find(
      user => user.email === email || user.username === username
    );

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS);
    const newUser: User = {
      id: uuidv4(),
      username,
      email,
      passwordHash,
      createdAt: new Date()
    };

    this.users.set(newUser.id, newUser);
    return newUser;
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    const user = Array.from(this.users.values()).find(u => u.email === email);
    
    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    return isValidPassword ? user : null;
  }

  private validateInput(username: string, email: string, password: string): void {
    if (!username || username.length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }
}

export default UserRegistrationService;