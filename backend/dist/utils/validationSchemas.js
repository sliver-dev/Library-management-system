"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationSchema = exports.returnBookSchema = exports.borrowBookSchema = exports.bookSearchSchema = exports.bookSchema = exports.updateUserSchema = exports.changePasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const validation_1 = require("./validation");
exports.registerSchema = joi_1.default.object({
    email: validation_1.emailSchema,
    password: validation_1.passwordSchema,
    first_name: validation_1.nameSchema.label('First name'),
    last_name: validation_1.nameSchema.label('Last name'),
    role: validation_1.roleSchema.optional(),
    phone: validation_1.phoneSchema,
    address: joi_1.default.string().max(500).optional().messages({
        'string.max': 'Address must be less than 500 characters',
    }),
});
exports.loginSchema = joi_1.default.object({
    email: validation_1.emailSchema,
    password: joi_1.default.string().required().messages({
        'any.required': 'Password is required',
    }),
});
exports.changePasswordSchema = joi_1.default.object({
    currentPassword: joi_1.default.string().required().messages({
        'any.required': 'Current password is required',
    }),
    newPassword: validation_1.passwordSchema.label('New password'),
});
exports.updateUserSchema = joi_1.default.object({
    first_name: validation_1.nameSchema.optional(),
    last_name: validation_1.nameSchema.optional(),
    phone: validation_1.phoneSchema,
    address: joi_1.default.string().max(500).optional().messages({
        'string.max': 'Address must be less than 500 characters',
    }),
});
exports.bookSchema = joi_1.default.object({
    isbn: joi_1.default.string().max(20).optional().messages({
        'string.max': 'ISBN must be less than 20 characters',
    }),
    title: joi_1.default.string().min(1).max(500).required().messages({
        'string.min': 'Title is required',
        'string.max': 'Title must be less than 500 characters',
        'any.required': 'Title is required',
    }),
    author: joi_1.default.string().min(1).max(200).required().messages({
        'string.min': 'Author is required',
        'string.max': 'Author must be less than 200 characters',
        'any.required': 'Author is required',
    }),
    genre: joi_1.default.string().min(1).max(100).required().messages({
        'string.min': 'Genre is required',
        'string.max': 'Genre must be less than 100 characters',
        'any.required': 'Genre is required',
    }),
    publisher: joi_1.default.string().max(200).optional().messages({
        'string.max': 'Publisher must be less than 200 characters',
    }),
    edition: joi_1.default.string().max(50).optional().messages({
        'string.max': 'Edition must be less than 50 characters',
    }),
    publication_year: joi_1.default.number().integer().min(1000).max(new Date().getFullYear()).optional().messages({
        'number.base': 'Publication year must be a number',
        'number.integer': 'Publication year must be an integer',
        'number.min': 'Publication year must be after 1000',
        'number.max': 'Publication year cannot be in the future',
    }),
    description: joi_1.default.string().max(2000).optional().messages({
        'string.max': 'Description must be less than 2000 characters',
    }),
    cover_image_url: joi_1.default.string().uri().optional().messages({
        'string.uri': 'Cover image URL must be a valid URL',
    }),
    total_copies: joi_1.default.number().integer().min(1).default(1).messages({
        'number.base': 'Total copies must be a number',
        'number.integer': 'Total copies must be an integer',
        'number.min': 'Total copies must be at least 1',
    }),
    barcode: joi_1.default.string().max(100).optional().messages({
        'string.max': 'Barcode must be less than 100 characters',
    }),
    rfid_tag: joi_1.default.string().max(100).optional().messages({
        'string.max': 'RFID tag must be less than 100 characters',
    }),
    location: joi_1.default.string().max(100).optional().messages({
        'string.max': 'Location must be less than 100 characters',
    }),
    acquisition_date: joi_1.default.date().optional().messages({
        'date.base': 'Acquisition date must be a valid date',
    }),
    cost: joi_1.default.number().min(0).optional().messages({
        'number.base': 'Cost must be a number',
        'number.min': 'Cost cannot be negative',
    }),
});
exports.bookSearchSchema = joi_1.default.object({
    title: joi_1.default.string().max(500).optional(),
    author: joi_1.default.string().max(200).optional(),
    genre: joi_1.default.string().max(100).optional(),
    available: joi_1.default.boolean().optional(),
    publication_year: joi_1.default.number().integer().min(1000).max(new Date().getFullYear()).optional(),
    page: joi_1.default.number().integer().min(1).default(1),
    limit: joi_1.default.number().integer().min(1).max(100).default(10),
    sort_by: joi_1.default.string().valid('title', 'author', 'publication_year', 'created_at').default('title'),
    sort_order: joi_1.default.string().valid('asc', 'desc').default('asc'),
});
exports.borrowBookSchema = joi_1.default.object({
    book_id: joi_1.default.string().uuid().required().messages({
        'string.guid': 'Invalid book ID format',
        'any.required': 'Book ID is required',
    }),
    due_date: joi_1.default.date().min('now').required().messages({
        'date.base': 'Due date must be a valid date',
        'date.min': 'Due date must be in the future',
        'any.required': 'Due date is required',
    }),
    notes: joi_1.default.string().max(500).optional().messages({
        'string.max': 'Notes must be less than 500 characters',
    }),
});
exports.returnBookSchema = joi_1.default.object({
    transaction_id: joi_1.default.string().uuid().required().messages({
        'string.guid': 'Invalid transaction ID format',
        'any.required': 'Transaction ID is required',
    }),
    notes: joi_1.default.string().max(500).optional().messages({
        'string.max': 'Notes must be less than 500 characters',
    }),
});
exports.reservationSchema = joi_1.default.object({
    book_id: joi_1.default.string().uuid().required().messages({
        'string.guid': 'Invalid book ID format',
        'any.required': 'Book ID is required',
    }),
    expiry_date: joi_1.default.date().min('now').required().messages({
        'date.base': 'Expiry date must be a valid date',
        'date.min': 'Expiry date must be in the future',
        'any.required': 'Expiry date is required',
    }),
    priority: joi_1.default.number().integer().min(1).default(1).messages({
        'number.base': 'Priority must be a number',
        'number.integer': 'Priority must be an integer',
        'number.min': 'Priority must be at least 1',
    }),
});
//# sourceMappingURL=validationSchemas.js.map