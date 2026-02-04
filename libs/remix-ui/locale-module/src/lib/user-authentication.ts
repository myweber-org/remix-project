import { sign, verify } from 'jsonwebtoken';

interface UserPayload {
  userId: string;
  email: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

export class AuthenticationService {
  static generateToken(user: UserPayload): string {
    return sign(
      {
        userId: user.userId,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  static verifyToken(token: string): UserPayload | null {
    try {
      const decoded = verify(token, JWT_SECRET) as UserPayload;
      return decoded;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  static validateUserCredentials(email: string, password: string): boolean {
    // This is a simplified example - in production, you would:
    // 1. Hash the password
    // 2. Query the database
    // 3. Compare hashed passwords
    const mockUsers = [
      { email: 'admin@example.com', password: 'admin123' },
      { email: 'user@example.com', password: 'user123' },
    ];

    return mockUsers.some(
      user => user.email === email && user.password === password
    );
  }
}