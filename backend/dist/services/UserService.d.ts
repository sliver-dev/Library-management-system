import { UserWithoutPassword, CreateUserData, UpdateUserData, UserRole } from '../models/User';
export declare class UserService {
    createUser(userData: CreateUserData): Promise<UserWithoutPassword>;
    getUsers(page?: number, limit?: number, role?: UserRole): Promise<{
        users: UserWithoutPassword[];
        total: number;
    }>;
    getUserById(userId: string): Promise<UserWithoutPassword | null>;
    updateUser(userId: string, updateData: UpdateUserData): Promise<UserWithoutPassword | null>;
    deleteUser(userId: string): Promise<boolean>;
    banUser(userId: string): Promise<UserWithoutPassword | null>;
    unbanUser(userId: string): Promise<UserWithoutPassword | null>;
    getUserStats(): Promise<{
        totalUsers: number;
        activeUsers: number;
        bannedUsers: number;
        adminUsers: number;
        regularUsers: number;
    }>;
    searchUsers(searchTerm: string, page?: number, limit?: number): Promise<{
        users: UserWithoutPassword[];
        total: number;
    }>;
}
//# sourceMappingURL=UserService.d.ts.map