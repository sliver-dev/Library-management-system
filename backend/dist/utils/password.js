"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const SALT_ROUNDS = 12;
const hashPassword = async (password) => {
    try {
        return await bcryptjs_1.default.hash(password, SALT_ROUNDS);
    }
    catch (error) {
        throw new Error('Password hashing failed');
    }
};
exports.hashPassword = hashPassword;
const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcryptjs_1.default.compare(password, hashedPassword);
    }
    catch (error) {
        throw new Error('Password comparison failed');
    }
};
exports.comparePassword = comparePassword;
const validatePassword = (password) => {
    if (!password || password.length < 8) {
        return {
            isValid: false,
            message: 'Password must be at least 8 characters long',
        };
    }
    if (password.length > 128) {
        return {
            isValid: false,
            message: 'Password must be less than 128 characters long',
        };
    }
    if (!/(?=.*[a-z])/.test(password)) {
        return {
            isValid: false,
            message: 'Password must contain at least one lowercase letter',
        };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
        return {
            isValid: false,
            message: 'Password must contain at least one uppercase letter',
        };
    }
    if (!/(?=.*\d)/.test(password)) {
        return {
            isValid: false,
            message: 'Password must contain at least one number',
        };
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
        return {
            isValid: false,
            message: 'Password must contain at least one special character (@$!%*?&)',
        };
    }
    return { isValid: true };
};
exports.validatePassword = validatePassword;
//# sourceMappingURL=password.js.map