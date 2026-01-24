import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

interface User {
  id: string;
  email: string;
  passwordHash: string;
}

class AuthenticationService {
  private users: Map<string, User> = new Map();

  async register(email: string, password: string): Promise<string> {
    const existingUser = Array.from(this.users.values()).find(
      user => user.email === email
    );
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = Date.now().toString();
    
    const user: User = {
      id: userId,
      email,
      passwordHash
    };

    this.users.set(userId, user);
    
    return this.generateToken(userId, email);
  }

  async login(email: string, password: string): Promise<string> {
    const user = Array.from(this.users.values()).find(
      user => user.email === email
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    return this.generateToken(user.id, user.email);
  }

  private generateToken(userId: string, email: string): string {
    return jwt.sign(
      { userId, email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  validateToken(token: string): { userId: string; email: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
      return decoded;
    } catch {
      return null;
    }
  }

  getUserById(userId: string): User | undefined {
    return this.users.get(userId);
  }
}

export { AuthenticationService };