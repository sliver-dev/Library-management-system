"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireUser = exports.requireAdmin = exports.authorize = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const database_1 = require("../config/database");
const authenticate = async (req, res, next) => {
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
        const payload = (0, jwt_1.verifyAccessToken)(token);
        const result = await (0, database_1.query)(`SELECT id, email, first_name, last_name, role, phone, address,
              is_banned, registration_date, last_login, profile_image_url,
              created_at, updated_at
       FROM users
       WHERE id = $1 AND is_banned = FALSE`, [payload.userId]);
        if (result.rows.length === 0) {
            res.status(401).json({
                success: false,
                error: 'User not found or banned',
            });
            return;
        }
        req.user = result.rows[0];
        next();
    }
    catch (error) {
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
exports.authenticate = authenticate;
const authorize = (allowedRoles) => {
    return (req, res, next) => {
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
exports.authorize = authorize;
exports.requireAdmin = (0, exports.authorize)(['admin']);
exports.requireUser = (0, exports.authorize)(['user', 'admin']);
//# sourceMappingURL=auth.js.map