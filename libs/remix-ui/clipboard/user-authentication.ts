
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-secret';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

interface UserPayload {
  userId: string;
  email: string;
  role: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  private refreshTokens: Map<string, string> = new Map();

  generateTokenPair(user: UserPayload): TokenPair {
    const accessToken = jwt.sign(
      { userId: user.userId, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { userId: user.userId, tokenId: crypto.randomUUID() },
      REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    this.refreshTokens.set(user.userId, refreshToken);
    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string): UserPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  refreshAccessToken(refreshToken: string): TokenPair | null {
    try {
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as {
        userId: string;
        tokenId: string;
      };

      const storedToken = this.refreshTokens.get(decoded.userId);
      if (!storedToken || storedToken !== refreshToken) {
        return null;
      }

      const user = this.getUserById(decoded.userId);
      if (!user) {
        return null;
      }

      return this.generateTokenPair(user);
    } catch (error) {
      return null;
    }
  }

  revokeRefreshToken(userId: string): void {
    this.refreshTokens.delete(userId);
  }

  private getUserById(userId: string): UserPayload | null {
    return {
      userId,
      email: 'user@example.com',
      role: 'user'
    };
  }
}

export { AuthService, type UserPayload, type TokenPair };