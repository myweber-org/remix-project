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
}