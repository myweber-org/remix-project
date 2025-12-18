import { User, UserRole } from './models/user';
import { Database } from './database';
import { ValidationError } from './errors/validationError';

export class UserRegistrationService {
    private db: Database;

    constructor(database: Database) {
        this.db = database;
    }

    async registerUser(email: string, password: string, role: UserRole = UserRole.USER): Promise<User> {
        this.validateEmail(email);
        this.validatePassword(password);

        const existingUser = await this.db.findUserByEmail(email);
        if (existingUser) {
            throw new ValidationError('User with this email already exists');
        }

        const hashedPassword = await this.hashPassword(password);
        const user: User = {
            id: this.generateUserId(),
            email,
            passwordHash: hashedPassword,
            role,
            createdAt: new Date(),
            isActive: true
        };

        await this.db.saveUser(user);
        return user;
    }

    private validateEmail(email: string): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new ValidationError('Invalid email format');
        }
    }

    private validatePassword(password: string): void {
        if (password.length < 8) {
            throw new ValidationError('Password must be at least 8 characters long');
        }

        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
            throw new ValidationError('Password must contain uppercase, lowercase, numbers and special characters');
        }
    }

    private async hashPassword(password: string): Promise<string> {
        // In a real application, use a proper hashing library like bcrypt
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