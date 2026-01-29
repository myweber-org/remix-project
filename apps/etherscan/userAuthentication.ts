import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
    user?: any;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'Access token required' });
        return;
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) {
            res.status(403).json({ error: 'Invalid or expired token' });
            return;
        }
        req.user = user;
        next();
    });
};

export const generateAccessToken = (userId: string, userRole: string): string => {
    return jwt.sign(
        { userId, role: userRole },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
};