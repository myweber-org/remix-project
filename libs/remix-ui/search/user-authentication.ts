import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export interface UserPayload {
    userId: string;
    email: string;
    role: string;
}

export class AuthenticationService {
    async generateToken(payload: UserPayload): Promise<string> {
        return jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
    }

    async verifyToken(token: string): Promise<UserPayload | null> {
        try {
            const decoded = jwt.verify(token, SECRET_KEY) as UserPayload;
            return decoded;
        } catch (error) {
            console.error('Token verification failed:', error);
            return null;
        }
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    extractTokenFromHeader(authHeader: string | undefined): string | null {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.substring(7);
    }
}import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRY = '24h';

export interface UserPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(user: UserPayload): string {
  const payload = {
    ...user,
    jti: uuidv4(),
    iat: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function validateToken(token: string): UserPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload & { jti: string; iat: number };
    const { jti, iat, ...userPayload } = decoded;
    return userPayload;
  } catch (error) {
    console.error('Token validation failed:', error);
    return null;
  }
}

export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}