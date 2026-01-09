import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

interface UserData {
  username: string;
  email: string;
  password: string;
  age?: number;
}

class UserRegistrationService {
  private readonly SALT_ROUNDS: number = 10;

  async registerUser(userData: UserData): Promise<{ userId: string; success: boolean }> {
    try {
      this.validateUserData(userData);
      
      const hashedPassword = await this.hashPassword(userData.password);
      const userId = this.generateUserId();
      
      const userRecord = {
        id: userId,
        username: userData.username,
        email: userData.email.toLowerCase(),
        passwordHash: hashedPassword,
        age: userData.age,
        registeredAt: new Date().toISOString()
      };

      await this.saveUserToDatabase(userRecord);
      
      return { userId, success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      return { userId: '', success: false };
    }
  }

  private validateUserData(userData: UserData): void {
    const { username, email, password } = userData;

    if (!username || username.length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }

    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  private generateUserId(): string {
    return uuidv4();
  }

  private async saveUserToDatabase(userRecord: any): Promise<void> {
    console.log('Saving user to database:', userRecord);
  }
}

export default UserRegistrationService;