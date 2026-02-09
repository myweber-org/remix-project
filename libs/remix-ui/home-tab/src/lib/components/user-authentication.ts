import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new AuthenticationError('Access token required');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    throw new AuthenticationError('Invalid or expired token');
  }
};

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AuthenticationError('User not authenticated');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AuthorizationError(
        `Insufficient permissions. Required roles: ${allowedRoles.join(', ')}`
      );
    }

    next();
  };
};

export const generateAccessToken = (userData: UserPayload): string => {
  return jwt.sign(userData, process.env.JWT_SECRET!, {
    expiresIn: '1h',
    issuer: 'api-server',
    audience: 'client-app'
  });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '7d',
    issuer: 'api-server'
  });
};