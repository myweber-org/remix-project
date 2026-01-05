
import { z } from 'zod';
import { DatabaseClient } from './database';
import { hashPassword, generateSalt } from './crypto';

const UserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
});

export class UserRegistrationService {
  constructor(private db: DatabaseClient) {}

  async register(userData: unknown): Promise<{ success: boolean; userId?: string; errors?: string[] }> {
    const validationResult = UserSchema.safeParse(userData);
    
    if (!validationResult.success) {
      return {
        success: false,
        errors: validationResult.error.errors.map(err => err.message)
      };
    }

    const { username, email, password } = validationResult.data;
    
    const existingUser = await this.db.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return {
        success: false,
        errors: ['User with this email or username already exists']
      };
    }

    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);

    try {
      const result = await this.db.query(
        `INSERT INTO users (username, email, password_hash, salt, created_at) 
         VALUES ($1, $2, $3, $4, NOW()) RETURNING id`,
        [username, email, hashedPassword, salt]
      );

      await this.db.query(
        'INSERT INTO user_profiles (user_id) VALUES ($1)',
        [result.rows[0].id]
      );

      return {
        success: true,
        userId: result.rows[0].id
      };
    } catch (error) {
      console.error('Registration failed:', error);
      return {
        success: false,
        errors: ['Database error occurred during registration']
      };
    }
  }
}