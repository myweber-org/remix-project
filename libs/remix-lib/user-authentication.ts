import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
const SALT_ROUNDS = 10;

interface UserCredentials {
  username: string;
  password: string;
}

interface TokenPayload {
  userId: string;
  username: string;
  role: string;
}

class AuthenticationService {
  private users = new Map<string, { passwordHash: string; role: string }>();

  async registerUser(username: string, password: string, role: string = 'user'): Promise<boolean> {
    if (this.users.has(username)) {
      return false;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    this.users.set(username, { passwordHash, role });
    return true;
  }

  async authenticateUser(credentials: UserCredentials): Promise<string | null> {
    const user = this.users.get(credentials.username);
    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(credentials.password, user.passwordHash);
    if (!isValidPassword) {
      return null;
    }

    const payload: TokenPayload = {
      userId: `user-${Date.now()}`,
      username: credentials.username,
      role: user.role
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  }

  validateToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
      return decoded;
    } catch {
      return null;
    }
  }

  getUserRole(username: string): string | undefined {
    return this.users.get(username)?.role;
  }
}

export { AuthenticationService, type UserCredentials, type TokenPayload };