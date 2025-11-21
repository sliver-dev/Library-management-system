import { UserWithoutPassword, CreateUserData, UserLoginData } from '../models/User';
export declare class AuthService {
    createUser(userData: CreateUserData): Promise<UserWithoutPassword>;
    authenticateUser(loginData: UserLoginData): Promise<{
        user: UserWithoutPassword;
        tokens: any;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    getUserById(userId: string): Promise<UserWithoutPassword | null>;
    updateUser(userId: string, updateData: Partial<CreateUserData>): Promise<UserWithoutPassword>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
}
//# sourceMappingURL=AuthService.d.ts.map