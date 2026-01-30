import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

interface UserData {
    username: string;
    email: string;
    password: string;
}

class UserRegistrationService {
    private readonly SALT_ROUNDS = 10;

    async registerUser(userData: UserData): Promise<{ success: boolean; userId?: string; error?: string }> {
        try {
            this.validateUserData(userData);
            
            const hashedPassword = await this.hashPassword(userData.password);
            const userId = this.generateUserId();
            
            await this.saveUserToDatabase({
                id: userId,
                username: userData.username,
                email: userData.email,
                passwordHash: hashedPassword,
                createdAt: new Date()
            });
            
            return { success: true, userId };
        } catch (error) {
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Registration failed' 
            };
        }
    }

    private validateUserData(userData: UserData): void {
        if (!userData.username || userData.username.length < 3) {
            throw new Error('Username must be at least 3 characters long');
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            throw new Error('Invalid email format');
        }
        
        if (!userData.password || userData.password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }
    }

    private async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.SALT_ROUNDS);
    }

    private generateUserId(): string {
        return uuidv4();
    }

    private async saveUserToDatabase(userRecord: any): Promise<void> {
        // Simulate database save operation
        console.log('Saving user to database:', userRecord);
        // In real implementation, this would connect to a database
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

export default UserRegistrationService;