import { hash, compare } from 'bcrypt';

interface UserData {
    username: string;
    email: string;
    password: string;
}

class UserRegistration {
    private readonly SALT_ROUNDS: number = 10;

    async validateUserInput(userData: UserData): Promise<boolean> {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailRegex.test(userData.email);
        const isUsernameValid = userData.username.length >= 3 && userData.username.length <= 20;
        const isPasswordValid = userData.password.length >= 8;

        return isEmailValid && isUsernameValid && isPasswordValid;
    }

    async hashPassword(password: string): Promise<string> {
        return await hash(password, this.SALT_ROUNDS);
    }

    async registerUser(userData: UserData): Promise<{ success: boolean; userId?: string; error?: string }> {
        const isValid = await this.validateUserInput(userData);
        if (!isValid) {
            return { success: false, error: 'Invalid user input' };
        }

        try {
            const hashedPassword = await this.hashPassword(userData.password);
            const userId = this.generateUserId();
            
            // Simulate saving to database
            await this.saveUserToDatabase({
                id: userId,
                username: userData.username,
                email: userData.email,
                passwordHash: hashedPassword
            });

            return { success: true, userId };
        } catch (error) {
            return { success: false, error: 'Registration failed' };
        }
    }

    private generateUserId(): string {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }

    private async saveUserToDatabase(user: any): Promise<void> {
        // Simulate database operation
        console.log('Saving user to database:', user);
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await compare(plainPassword, hashedPassword);
    }
}

export { UserRegistration, UserData };import { User, UserRepository } from './userRepository';
import { ValidationError } from './errors/validationError';

export interface RegistrationData {
    email: string;
    password: string;
    username: string;
    dateOfBirth?: Date;
}

export class UserRegistrationService {
    constructor(private userRepository: UserRepository) {}

    async register(data: RegistrationData): Promise<User> {
        this.validateRegistrationData(data);

        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new ValidationError('Email already registered');
        }

        const existingUsername = await this.userRepository.findByUsername(data.username);
        if (existingUsername) {
            throw new ValidationError('Username already taken');
        }

        const hashedPassword = await this.hashPassword(data.password);
        const user = await this.userRepository.create({
            email: data.email,
            passwordHash: hashedPassword,
            username: data.username,
            dateOfBirth: data.dateOfBirth,
            registeredAt: new Date(),
            isActive: true
        });

        await this.sendWelcomeEmail(user.email);
        return user;
    }

    private validateRegistrationData(data: RegistrationData): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            throw new ValidationError('Invalid email format');
        }

        if (data.password.length < 8) {
            throw new ValidationError('Password must be at least 8 characters long');
        }

        if (data.username.length < 3 || data.username.length > 20) {
            throw new ValidationError('Username must be between 3 and 20 characters');
        }

        if (data.dateOfBirth && data.dateOfBirth > new Date()) {
            throw new ValidationError('Date of birth cannot be in the future');
        }
    }

    private async hashPassword(password: string): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    private async sendWelcomeEmail(email: string): Promise<void> {
        console.log(`Sending welcome email to ${email}`);
    }
}