"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const database_1 = require("../config/database");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
class AuthService {
    async createUser(userData) {
        const { email, password, first_name, last_name, role = 'user', phone, address } = userData;
        const passwordValidation = (0, password_1.validatePassword)(password);
        if (!passwordValidation.isValid) {
            throw new Error(passwordValidation.message);
        }
        const existingUser = await (0, database_1.query)('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            throw new Error('User with this email already exists');
        }
        const passwordHash = await (0, password_1.hashPassword)(password);
        const result = await (0, database_1.query)(`INSERT INTO users (email, password_hash, first_name, last_name, role, phone, address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, first_name, last_name, role, phone, address,
                is_banned, registration_date, last_login, profile_image_url,
                created_at, updated_at`, [email, passwordHash, first_name, last_name, role, phone, address]);
        return result.rows[0];
    }
    async authenticateUser(loginData) {
        const { email, password } = loginData;
        const result = await (0, database_1.query)(`SELECT id, email, password_hash, first_name, last_name, role, phone, address,
              is_banned, registration_date, last_login, profile_image_url,
              created_at, updated_at
       FROM users
       WHERE email = $1`, [email]);
        if (result.rows.length === 0) {
            throw new Error('Invalid email or password');
        }
        const user = result.rows[0];
        if (user.is_banned) {
            throw new Error('Account has been banned');
        }
        const isPasswordValid = await (0, password_1.comparePassword)(password, user.password_hash);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        const { password_hash: _, ...userWithoutPassword } = user;
        await (0, database_1.query)('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);
        const tokens = (0, jwt_1.generateTokenPair)(userWithoutPassword);
        return {
            user: userWithoutPassword,
            tokens,
        };
    }
    async refreshToken(refreshToken) {
        const { verifyRefreshToken, generateAccessToken } = require('../utils/jwt');
        try {
            const payload = verifyRefreshToken(refreshToken);
            const result = await (0, database_1.query)(`SELECT id, email, first_name, last_name, role, phone, address,
                is_banned, registration_date, last_login, profile_image_url,
                created_at, updated_at
         FROM users
         WHERE id = $1 AND is_banned = FALSE`, [payload.userId]);
            if (result.rows.length === 0) {
                throw new Error('User not found or banned');
            }
            const user = result.rows[0];
            const accessToken = generateAccessToken(user);
            return { accessToken };
        }
        catch (error) {
            throw new Error('Invalid or expired refresh token');
        }
    }
    async getUserById(userId) {
        const result = await (0, database_1.query)(`SELECT id, email, first_name, last_name, role, phone, address,
              is_banned, registration_date, last_login, profile_image_url,
              created_at, updated_at
       FROM users
       WHERE id = $1`, [userId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }
    async updateUser(userId, updateData) {
        const { first_name, last_name, phone, address } = updateData;
        const result = await (0, database_1.query)(`UPDATE users
       SET first_name = COALESCE($2, first_name),
           last_name = COALESCE($3, last_name),
           phone = COALESCE($4, phone),
           address = COALESCE($5, address),
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, email, first_name, last_name, role, phone, address,
                is_banned, registration_date, last_login, profile_image_url,
                created_at, updated_at`, [userId, first_name, last_name, phone, address]);
        if (result.rows.length === 0) {
            throw new Error('User not found');
        }
        return result.rows[0];
    }
    async changePassword(userId, currentPassword, newPassword) {
        const passwordValidation = (0, password_1.validatePassword)(newPassword);
        if (!passwordValidation.isValid) {
            throw new Error(passwordValidation.message);
        }
        const result = await (0, database_1.query)('SELECT password_hash FROM users WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            throw new Error('User not found');
        }
        const { password_hash } = result.rows[0];
        const isCurrentPasswordValid = await (0, password_1.comparePassword)(currentPassword, password_hash);
        if (!isCurrentPasswordValid) {
            throw new Error('Current password is incorrect');
        }
        const newPasswordHash = await (0, password_1.hashPassword)(newPassword);
        await (0, database_1.query)('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [newPasswordHash, userId]);
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map