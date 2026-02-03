import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

interface User {
  id: string;
  username: string;
  passwordHash: string;
}

class AuthenticationService {
  private users: Map<string, User> = new Map();

  async register(username: string, password: string): Promise<string> {
    if (this.users.has(username)) {
      throw new Error('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = Date.now().toString();
    
    const user: User = {
      id: userId,
      username,
      passwordHash
    };

    this.users.set(username, user);
    return this.generateToken(user);
  }

  async login(username: string, password: string): Promise<string> {
    const user = this.users.get(username);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    return this.generateToken(user);
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      username: user.username,
      iat: Math.floor(Date.now() / 1000)
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  validateToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  getUserByUsername(username: string): User | undefined {
    return this.users.get(username);
  }
}

export default AuthenticationService;