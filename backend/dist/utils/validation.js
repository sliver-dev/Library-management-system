"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuidSchema = exports.roleSchema = exports.phoneSchema = exports.nameSchema = exports.passwordSchema = exports.emailSchema = exports.validate = void 0;
const joi_1 = __importDefault(require("joi"));
const validate = (schema, data) => {
    const { error, value } = schema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
    });
    return { error, value };
};
exports.validate = validate;
exports.emailSchema = joi_1.default.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required',
});
exports.passwordSchema = joi_1.default.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.max': 'Password must be less than 128 characters long',
    'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (@$!%*?&)',
    'any.required': 'Password is required',
});
exports.nameSchema = joi_1.default.string().min(2).max(50).required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name must be less than 50 characters long',
    'any.required': 'Name is required',
});
exports.phoneSchema = joi_1.default.string().pattern(/^[+]?[\d\s\-()]{10,20}$/).optional().messages({
    'string.pattern.base': 'Please enter a valid phone number',
});
exports.roleSchema = joi_1.default.string().valid('admin', 'user').default('user');
exports.uuidSchema = joi_1.default.string().uuid().required().messages({
    'string.guid': 'Invalid ID format',
    'any.required': 'ID is required',
});
//# sourceMappingURL=validation.js.map