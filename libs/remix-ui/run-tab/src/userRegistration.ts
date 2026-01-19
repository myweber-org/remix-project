import { User, UserRole } from './models/User';
import { DatabaseConnection } from './database/DatabaseConnection';
import { ValidationError } from './errors/ValidationError';

export class UserRegistrationService {
    private db: DatabaseConnection;

    constructor(databaseConnection: DatabaseConnection) {
        this.db = databaseConnection;
    }

    async registerUser(email: string, password: string, username: string, role: UserRole = UserRole.USER): Promise<User> {
        this.validateInput(email, password, username);

        const existingUser = await this.db.findUserByEmail(email);
        if (existingUser) {
            throw new ValidationError('Email already registered');
        }

        const hashedPassword = await this.hashPassword(password);
        const user: User = {
            id: this.generateUserId(),
            email,
            password: hashedPassword,
            username,
            role,
            createdAt: new Date(),
            isActive: true
        };

        await this.db.saveUser(user);
        return user;
    }

    private validateInput(email: string, password: string, username: string): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new ValidationError('Invalid email format');
        }

        if (password.length < 8) {
            throw new ValidationError('Password must be at least 8 characters long');
        }

        if (username.length < 3 || username.length > 20) {
            throw new ValidationError('Username must be between 3 and 20 characters');
        }
    }

    private async hashPassword(password: string): Promise<string> {
        // Implementation would use a proper hashing library like bcrypt
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    private generateUserId(): string {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}