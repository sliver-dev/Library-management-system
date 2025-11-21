import { query } from '../config/database';
import { User, UserWithoutPassword, CreateUserData, UserLoginData, UserRole } from '../models/User';
import { hashPassword, comparePassword, validatePassword } from '../utils/password';
import { generateTokenPair } from '../utils/jwt';

export class AuthService {
  async createUser(userData: CreateUserData): Promise<UserWithoutPassword> {
    const { email, password, first_name, last_name, role = 'user', phone, address } = userData;

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message);
    }

    // Check if user already exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Insert user
    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, phone, address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, first_name, last_name, role, phone, address,
                is_banned, registration_date, last_login, profile_image_url,
                created_at, updated_at`,
      [email, passwordHash, first_name, last_name, role, phone, address]
    );

    return result.rows[0] as UserWithoutPassword;
  }

  async authenticateUser(loginData: UserLoginData): Promise<{ user: UserWithoutPassword; tokens: any }> {
    const { email, password } = loginData;

    // Find user by email
    const result = await query(
      `SELECT id, email, password_hash, first_name, last_name, role, phone, address,
              is_banned, registration_date, last_login, profile_image_url,
              created_at, updated_at
       FROM users
       WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid email or password');
    }

    const user = result.rows[0] as User & { password_hash: string };

    // Check if user is banned
    if (user.is_banned) {
      throw new Error('Account has been banned');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Remove password hash from user object
    const { password_hash: _, ...userWithoutPassword } = user;

    // Update last login
    await query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    // Generate tokens
    const tokens = generateTokenPair(userWithoutPassword as UserWithoutPassword);

    return {
      user: userWithoutPassword as UserWithoutPassword,
      tokens,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const { verifyRefreshToken, generateAccessToken } = require('../utils/jwt');

    try {
      const payload = verifyRefreshToken(refreshToken);

      // Verify user still exists and is not banned
      const result = await query(
        `SELECT id, email, first_name, last_name, role, phone, address,
                is_banned, registration_date, last_login, profile_image_url,
                created_at, updated_at
         FROM users
         WHERE id = $1 AND is_banned = FALSE`,
        [payload.userId]
      );

      if (result.rows.length === 0) {
        throw new Error('User not found or banned');
      }

      const user = result.rows[0] as UserWithoutPassword;

      // Generate new access token
      const accessToken = generateAccessToken(user);

      return { accessToken };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  async getUserById(userId: string): Promise<UserWithoutPassword | null> {
    const result = await query(
      `SELECT id, email, first_name, last_name, role, phone, address,
              is_banned, registration_date, last_login, profile_image_url,
              created_at, updated_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    return result.rows.length > 0 ? (result.rows[0] as UserWithoutPassword) : null;
  }

  async updateUser(userId: string, updateData: Partial<CreateUserData>): Promise<UserWithoutPassword> {
    const { first_name, last_name, phone, address } = updateData;

    const result = await query(
      `UPDATE users
       SET first_name = COALESCE($2, first_name),
           last_name = COALESCE($3, last_name),
           phone = COALESCE($4, phone),
           address = COALESCE($5, address),
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, email, first_name, last_name, role, phone, address,
                is_banned, registration_date, last_login, profile_image_url,
                created_at, updated_at`,
      [userId, first_name, last_name, phone, address]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    return result.rows[0] as UserWithoutPassword;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message);
    }

    // Get current password hash
    const result = await query('SELECT password_hash FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    const { password_hash } = result.rows[0];

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(currentPassword, password_hash);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    await query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [newPasswordHash, userId]
    );
  }
}