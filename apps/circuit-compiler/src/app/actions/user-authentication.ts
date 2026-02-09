import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

interface UserPayload {
  userId: string;
  email: string;
  role: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

class AuthenticationService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  constructor() {
    this.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'default-access-secret';
    this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'default-refresh-secret';
    this.accessTokenExpiry = '15m';
    this.refreshTokenExpiry = '7d';
  }

  generateTokenPair(userPayload: UserPayload): TokenPair {
    const accessToken = jwt.sign(
      { ...userPayload, type: 'access' },
      this.accessTokenSecret,
      { expiresIn: this.accessTokenExpiry }
    );

    const refreshToken = jwt.sign(
      { userId: userPayload.userId, jti: uuidv4(), type: 'refresh' },
      this.refreshTokenSecret,
      { expiresIn: this.refreshTokenExpiry }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 900 // 15 minutes in seconds
    };
  }

  verifyAccessToken(token: string): UserPayload | null {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret) as UserPayload & jwt.JwtPayload;
      return { userId: decoded.userId, email: decoded.email, role: decoded.role };
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret) as { userId: string } & jwt.JwtPayload;
      return { userId: decoded.userId };
    } catch (error) {
      return null;
    }
  }

  refreshAccessToken(refreshToken: string, userData: UserPayload): string | null {
    const verified = this.verifyRefreshToken(refreshToken);
    if (!verified || verified.userId !== userData.userId) {
      return null;
    }

    return jwt.sign(
      { ...userData, type: 'access' },
      this.accessTokenSecret,
      { expiresIn: this.accessTokenExpiry }
    );
  }
}

export { AuthenticationService, UserPayload, TokenPair };