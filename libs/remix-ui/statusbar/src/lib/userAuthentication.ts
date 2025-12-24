import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRY = '24h';

interface UserPayload {
    userId: string;
    email: string;
    role: string;
}

export class AuthService {
    static async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    static generateToken(userPayload: UserPayload): string {
        return jwt.sign(userPayload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    }

    static verifyToken(token: string): UserPayload | null {
        try {
            return jwt.verify(token, JWT_SECRET) as UserPayload;
        } catch {
            return null;
        }
    }

    static extractTokenFromHeader(authHeader: string | undefined): string | null {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.substring(7);
    }
}