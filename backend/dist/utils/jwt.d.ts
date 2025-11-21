import { UserWithoutPassword, UserRole } from '../models/User';
interface JWTPayload {
    userId: string;
    email: string;
    role: UserRole;
}
interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
export declare const generateAccessToken: (user: UserWithoutPassword) => string;
export declare const generateRefreshToken: (user: UserWithoutPassword) => string;
export declare const generateTokenPair: (user: UserWithoutPassword) => TokenPair;
export declare const verifyAccessToken: (token: string) => JWTPayload;
export declare const verifyRefreshToken: (token: string) => JWTPayload;
export {};
//# sourceMappingURL=jwt.d.ts.map