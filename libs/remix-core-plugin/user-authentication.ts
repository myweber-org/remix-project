import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '1h';

interface UserPayload {
  userId: string;
  email: string;
  role: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  static async verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static generateToken(userPayload: UserPayload): string {
    return jwt.sign(userPayload, SECRET_KEY, { expiresIn: TOKEN_EXPIRY });
  }

  static verifyToken(token: string): UserPayload | null {
    try {
      return jwt.verify(token, SECRET_KEY) as UserPayload;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  static extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}