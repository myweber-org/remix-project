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

export { UserRegistration, UserData };