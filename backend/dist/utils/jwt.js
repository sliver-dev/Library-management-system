"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateTokenPair = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const generateAccessToken = (user) => {
    const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };
    const options = {
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'library-management-system',
        audience: 'library-management-users',
    };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (user) => {
    const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };
    const refreshOptions = {
        expiresIn: JWT_REFRESH_EXPIRES_IN,
        issuer: 'library-management-system',
        audience: 'library-management-users',
    };
    return jsonwebtoken_1.default.sign(payload, JWT_REFRESH_SECRET, refreshOptions);
};
exports.generateRefreshToken = generateRefreshToken;
const generateTokenPair = (user) => {
    return {
        accessToken: (0, exports.generateAccessToken)(user),
        refreshToken: (0, exports.generateRefreshToken)(user),
    };
};
exports.generateTokenPair = generateTokenPair;
const verifyAccessToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET, {
            issuer: 'library-management-system',
            audience: 'library-management-users',
        });
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new Error('Access token expired');
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new Error('Invalid access token');
        }
        throw new Error('Token verification failed');
    }
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET, {
            issuer: 'library-management-system',
            audience: 'library-management-users',
        });
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new Error('Refresh token expired');
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new Error('Invalid refresh token');
        }
        throw new Error('Refresh token verification failed');
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
//# sourceMappingURL=jwt.js.map