import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';

interface UserPayload {
  userId: string;
  email: string;
  role: string;
}

export class AuthService {
  private refreshTokens = new Map<string, string>();

  generateAccessToken(payload: UserPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  }

  generateRefreshToken(payload: UserPayload): string {
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
    const tokenId = crypto.randomBytes(16).toString('hex');
    this.refreshTokens.set(tokenId, refreshToken);
    return tokenId;
  }

  verifyAccessToken(token: string): UserPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as UserPayload;
    } catch {
      return null;
    }
  }

  refreshAccessToken(refreshTokenId: string): { accessToken: string; newRefreshTokenId: string } | null {
    const storedRefreshToken = this.refreshTokens.get(refreshTokenId);
    if (!storedRefreshToken) return null;

    try {
      const payload = jwt.verify(storedRefreshToken, JWT_REFRESH_SECRET) as UserPayload;
      this.refreshTokens.delete(refreshTokenId);

      const newAccessToken = this.generateAccessToken(payload);
      const newRefreshTokenId = this.generateRefreshToken(payload);

      return {
        accessToken: newAccessToken,
        newRefreshTokenId
      };
    } catch {
      this.refreshTokens.delete(refreshTokenId);
      return null;
    }
  }

  revokeRefreshToken(refreshTokenId: string): void {
    this.refreshTokens.delete(refreshTokenId);
  }

  validateUserCredentials(email: string, password: string): UserPayload | null {
    // This should be replaced with actual database lookup
    const mockUser = {
      userId: '123',
      email: 'user@example.com',
      role: 'user',
      password: 'hashed-password'
    };

    if (email === mockUser.email && password === 'password123') {
      return {
        userId: mockUser.userId,
        email: mockUser.email,
        role: mockUser.role
      };
    }
    return null;
  }
}