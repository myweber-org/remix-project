import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Authentication token required' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: 'Invalid or expired token' });
      return;
    }

    req.user = decoded as AuthenticatedRequest['user'];
    next();
  });
};

export const generateAccessToken = (user: { id: string; email: string; role: string }): string => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
};

export const authorizeRole = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};import { sign, verify, SignOptions, VerifyOptions } from 'jsonwebtoken';

interface UserPayload {
  userId: string;
  email: string;
  role: string;
}

interface TokenConfig {
  secret: string;
  expiresIn: string;
}

class AuthenticationService {
  private readonly config: TokenConfig;

  constructor(config: TokenConfig) {
    this.config = config;
  }

  generateToken(userPayload: UserPayload): string {
    const options: SignOptions = {
      expiresIn: this.config.expiresIn,
      algorithm: 'HS256'
    };

    return sign(userPayload, this.config.secret, options);
  }

  validateToken(token: string): UserPayload | null {
    try {
      const options: VerifyOptions = {
        algorithms: ['HS256']
      };

      const decoded = verify(token, this.config.secret, options) as UserPayload;
      return decoded;
    } catch (error) {
      console.error('Token validation failed:', error);
      return null;
    }
  }

  extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  authenticateRequest(authHeader: string | undefined): UserPayload | null {
    const token = this.extractTokenFromHeader(authHeader);
    if (!token) {
      return null;
    }
    return this.validateToken(token);
  }
}

export { AuthenticationService, UserPayload, TokenConfig };