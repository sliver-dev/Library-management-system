export type UserRole = 'admin' | 'user';
export interface User {
    id: string;
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    role: UserRole;
    phone?: string;
    address?: string;
    is_banned: boolean;
    registration_date: Date;
    last_login?: Date;
    profile_image_url?: string;
    created_at: Date;
    updated_at: Date;
}
export interface CreateUserData {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role?: UserRole;
    phone?: string;
    address?: string;
}
export interface UpdateUserData {
    first_name?: string;
    last_name?: string;
    phone?: string;
    address?: string;
    profile_image_url?: string;
    role?: UserRole;
    is_banned?: boolean;
}
export interface UserLoginData {
    email: string;
    password: string;
}
export interface UserWithoutPassword extends Omit<User, 'password_hash'> {
}
//# sourceMappingURL=User.d.ts.map