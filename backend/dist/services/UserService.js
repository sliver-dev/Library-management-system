"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const database_1 = require("../config/database");
class UserService {
    async createUser(userData) {
        const { email, password, first_name, last_name, role = 'user', phone, address } = userData;
        try {
            const existingUser = await (0, database_1.query)('SELECT id FROM users WHERE email = $1', [email]);
            if (existingUser.rows.length > 0) {
                throw new Error('User with this email already exists');
            }
            const { hashPassword } = await Promise.resolve().then(() => __importStar(require('../utils/password')));
            const passwordHash = await hashPassword(password);
            const result = await (0, database_1.query)(`INSERT INTO users (email, password_hash, first_name, last_name, role, phone, address)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, email, first_name, last_name, role, phone, address,
                  is_banned, registration_date, last_login, profile_image_url,
                  created_at, updated_at`, [email, passwordHash, first_name, last_name, role, phone, address]);
            return result.rows[0];
        }
        catch (error) {
            throw new Error('Failed to create user');
        }
    }
    async getUsers(page = 1, limit = 10, role) {
        const offset = (page - 1) * limit;
        let whereClause = 'WHERE 1=1';
        const queryParams = [];
        let paramIndex = 1;
        if (role) {
            whereClause += ` AND role = $${paramIndex}`;
            queryParams.push(role);
            paramIndex++;
        }
        try {
            const countResult = await (0, database_1.query)(`SELECT COUNT(*) FROM users ${whereClause}`, queryParams);
            const total = parseInt(countResult.rows[0].count);
            const usersResult = await (0, database_1.query)(`SELECT id, email, first_name, last_name, role, phone, address,
                is_banned, registration_date, last_login, profile_image_url,
                created_at, updated_at
         FROM users
         ${whereClause}
         ORDER BY created_at DESC
         LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`, [...queryParams, limit, offset]);
            return {
                users: usersResult.rows,
                total,
            };
        }
        catch (error) {
            console.error('Error getting users:', error);
            throw new Error('Failed to retrieve users');
        }
    }
    async getUserById(userId) {
        try {
            const result = await (0, database_1.query)(`SELECT id, email, first_name, last_name, role, phone, address,
                is_banned, registration_date, last_login, profile_image_url,
                created_at, updated_at
         FROM users
         WHERE id = $1`, [userId]);
            return result.rows.length > 0 ? result.rows[0] : null;
        }
        catch (error) {
            console.error('Error getting user by ID:', error);
            throw new Error('Failed to retrieve user');
        }
    }
    async updateUser(userId, updateData) {
        const { first_name, last_name, phone, address, profile_image_url, role, is_banned, } = updateData;
        try {
            const updateFields = [];
            const updateValues = [];
            let paramIndex = 1;
            if (first_name !== undefined) {
                updateFields.push(`first_name = $${paramIndex}`);
                updateValues.push(first_name);
                paramIndex++;
            }
            if (last_name !== undefined) {
                updateFields.push(`last_name = $${paramIndex}`);
                updateValues.push(last_name);
                paramIndex++;
            }
            if (phone !== undefined) {
                updateFields.push(`phone = $${paramIndex}`);
                updateValues.push(phone);
                paramIndex++;
            }
            if (address !== undefined) {
                updateFields.push(`address = $${paramIndex}`);
                updateValues.push(address);
                paramIndex++;
            }
            if (profile_image_url !== undefined) {
                updateFields.push(`profile_image_url = $${paramIndex}`);
                updateValues.push(profile_image_url);
                paramIndex++;
            }
            if (role !== undefined) {
                updateFields.push(`role = $${paramIndex}`);
                updateValues.push(role);
                paramIndex++;
            }
            if (is_banned !== undefined) {
                updateFields.push(`is_banned = $${paramIndex}`);
                updateValues.push(is_banned);
                paramIndex++;
            }
            if (updateFields.length === 0) {
                throw new Error('No fields to update');
            }
            updateFields.push(`updated_at = NOW()`);
            const result = await (0, database_1.query)(`UPDATE users
         SET ${updateFields.join(', ')}
         WHERE id = $${paramIndex}
         RETURNING id, email, first_name, last_name, role, phone, address,
                  is_banned, registration_date, last_login, profile_image_url,
                  created_at, updated_at`, [...updateValues, userId]);
            return result.rows.length > 0 ? result.rows[0] : null;
        }
        catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Failed to update user');
        }
    }
    async deleteUser(userId) {
        const { getClient } = await Promise.resolve().then(() => __importStar(require('../config/database')));
        const client = await getClient();
        try {
            await client.query('BEGIN');
            await client.query('DELETE FROM user_reading_history WHERE user_id = $1', [userId]);
            await client.query('DELETE FROM user_preferences WHERE user_id = $1', [userId]);
            await client.query('DELETE FROM reservations WHERE user_id = $1', [userId]);
            await client.query(`UPDATE borrowing_transactions
         SET status = 'lost', actual_return_date = NOW()
         WHERE user_id = $1 AND status = 'issued'`, [userId]);
            const result = await client.query('DELETE FROM users WHERE id = $1', [userId]);
            await client.query('COMMIT');
            return result.rowCount !== null && result.rowCount > 0;
        }
        catch (error) {
            await client.query('ROLLBACK');
            console.error('Error deleting user:', error);
            throw new Error('Failed to delete user');
        }
        finally {
            client.release();
        }
    }
    async banUser(userId) {
        try {
            const result = await (0, database_1.query)(`UPDATE users
         SET is_banned = TRUE, updated_at = NOW()
         WHERE id = $1
         RETURNING id, email, first_name, last_name, role, phone, address,
                  is_banned, registration_date, last_login, profile_image_url,
                  created_at, updated_at`, [userId]);
            return result.rows.length > 0 ? result.rows[0] : null;
        }
        catch (error) {
            console.error('Error banning user:', error);
            throw new Error('Failed to ban user');
        }
    }
    async unbanUser(userId) {
        try {
            const result = await (0, database_1.query)(`UPDATE users
         SET is_banned = FALSE, updated_at = NOW()
         WHERE id = $1
         RETURNING id, email, first_name, last_name, role, phone, address,
                  is_banned, registration_date, last_login, profile_image_url,
                  created_at, updated_at`, [userId]);
            return result.rows.length > 0 ? result.rows[0] : null;
        }
        catch (error) {
            console.error('Error unbanning user:', error);
            throw new Error('Failed to unban user');
        }
    }
    async getUserStats() {
        try {
            const result = await (0, database_1.query)(`
        SELECT
          COUNT(*) as total_users,
          COUNT(CASE WHEN is_banned = FALSE THEN 1 END) as active_users,
          COUNT(CASE WHEN is_banned = TRUE THEN 1 END) as banned_users,
          COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_users,
          COUNT(CASE WHEN role = 'user' THEN 1 END) as regular_users
        FROM users
      `);
            const stats = result.rows[0];
            return {
                totalUsers: parseInt(stats.total_users),
                activeUsers: parseInt(stats.active_users),
                bannedUsers: parseInt(stats.banned_users),
                adminUsers: parseInt(stats.admin_users),
                regularUsers: parseInt(stats.regular_users),
            };
        }
        catch (error) {
            console.error('Error getting user stats:', error);
            throw new Error('Failed to retrieve user statistics');
        }
    }
    async searchUsers(searchTerm, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const searchPattern = `%${searchTerm}%`;
        try {
            const countResult = await (0, database_1.query)(`SELECT COUNT(*) FROM users
         WHERE LOWER(email) LIKE LOWER($1)
            OR LOWER(first_name) LIKE LOWER($1)
            OR LOWER(last_name) LIKE LOWER($1)`, [searchPattern]);
            const total = parseInt(countResult.rows[0].count);
            const usersResult = await (0, database_1.query)(`SELECT id, email, first_name, last_name, role, phone, address,
                is_banned, registration_date, last_login, profile_image_url,
                created_at, updated_at
         FROM users
         WHERE LOWER(email) LIKE LOWER($1)
            OR LOWER(first_name) LIKE LOWER($1)
            OR LOWER(last_name) LIKE LOWER($1)
         ORDER BY first_name, last_name
         LIMIT $2 OFFSET $3`, [searchPattern, limit, offset]);
            return {
                users: usersResult.rows,
                total,
            };
        }
        catch (error) {
            console.error('Error searching users:', error);
            throw new Error('Failed to search users');
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map