import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { query } from '../config/database';
import { UserWithoutPassword, UserRole } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: UserWithoutPassword;
    }
  }
}

interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Access token required',
      });
      return;
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    // Fetch user from database to ensure they exist and are not banned
    const result = await query(
      `SELECT id, email, first_name, last_name, role, phone, address,
              is_banned, registration_date, last_login, profile_image_url,
              created_at, updated_at
       FROM users
       WHERE id = $1 AND is_banned = FALSE`,
      [payload.userId]
    );

    if (result.rows.length === 0) {
      res.status(401).json({
        success: false,
        error: 'User not found or banned',
      });
      return;
    }

    req.user = result.rows[0] as UserWithoutPassword;
    next();
  } catch (error) {
    console.error('Authentication error:', error);

    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        res.status(401).json({
          success: false,
          error: 'Token expired',
          code: 'TOKEN_EXPIRED',
        });
        return;
      }

      if (error.message.includes('invalid')) {
        res.status(401).json({
          success: false,
          error: 'Invalid token',
        });
        return;
      }
    }

    res.status(500).json({
      success: false,
      error: 'Authentication failed',
    });
  }
};

export const authorize = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
};

// Role-specific middleware helpers
export const requireAdmin = authorize(['admin']);
export const requireUser = authorize(['user', 'admin']);