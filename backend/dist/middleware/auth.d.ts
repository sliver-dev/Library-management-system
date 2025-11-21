import { Request, Response, NextFunction } from 'express';
import { UserWithoutPassword, UserRole } from '../models/User';
declare global {
    namespace Express {
        interface Request {
            user?: UserWithoutPassword;
        }
    }
}
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const authorize: (allowedRoles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => void;
export declare const requireUser: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map