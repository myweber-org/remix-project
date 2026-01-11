import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

class UserRegistrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserRegistrationError';
  }
}

class UserValidator {
  static validateUsername(username: string): void {
    if (username.length < 3 || username.length > 20) {
      throw new UserRegistrationError('Username must be between 3 and 20 characters');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      throw new UserRegistrationError('Username can only contain letters, numbers, and underscores');
    }
  }

  static validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new UserRegistrationError('Invalid email format');
    }
  }

  static validatePassword(password: string): void {
    if (password.length < 8) {
      throw new UserRegistrationError('Password must be at least 8 characters long');
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      throw new UserRegistrationError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
    }
  }
}

class UserRepository {
  private users: Map<string, User> = new Map();

  async save(user: User): Promise<void> {
    await this.simulateDatabaseDelay();
    this.users.set(user.id, user);
  }

  async findByEmail(email: string): Promise<User | null> {
    await this.simulateDatabaseDelay();
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findByUsername(username: string): Promise<User | null> {
    await this.simulateDatabaseDelay();
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  private simulateDatabaseDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 10));
  }
}

class PasswordHasher {
  static async hashPassword(password: string): Promise<string> {
    await this.simulateHashingDelay();
    return `hashed_${password}_${Date.now()}`;
  }

  private static simulateHashingDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 50));
  }
}

class UserRegistrationService {
  constructor(private userRepository: UserRepository) {}

  async register(username: string, email: string, password: string): Promise<User> {
    try {
      UserValidator.validateUsername(username);
      UserValidator.validateEmail(email);
      UserValidator.validatePassword(password);

      const existingUserByEmail = await this.userRepository.findByEmail(email);
      if (existingUserByEmail) {
        throw new UserRegistrationError('Email already registered');
      }

      const existingUserByUsername = await this.userRepository.findByUsername(username);
      if (existingUserByUsername) {
        throw new UserRegistrationError('Username already taken');
      }

      const passwordHash = await PasswordHasher.hashPassword(password);
      
      const user: User = {
        id: uuidv4(),
        username,
        email,
        passwordHash,
        createdAt: new Date()
      };

      await this.userRepository.save(user);
      return user;
    } catch (error) {
      if (error instanceof UserRegistrationError) {
        throw error;
      }
      throw new UserRegistrationError('Registration failed due to system error');
    }
  }
}

export { User, UserRegistrationService, UserRepository, UserRegistrationError };