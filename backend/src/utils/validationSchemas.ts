import Joi from 'joi';
import { emailSchema, passwordSchema, nameSchema, phoneSchema, roleSchema } from './validation';

export const registerSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
  first_name: nameSchema.label('First name'),
  last_name: nameSchema.label('Last name'),
  role: roleSchema.optional(),
  phone: phoneSchema,
  address: Joi.string().max(500).optional().messages({
    'string.max': 'Address must be less than 500 characters',
  }),
});

export const loginSchema = Joi.object({
  email: emailSchema,
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'any.required': 'Current password is required',
  }),
  newPassword: passwordSchema.label('New password'),
});

export const updateUserSchema = Joi.object({
  first_name: nameSchema.optional(),
  last_name: nameSchema.optional(),
  phone: phoneSchema,
  address: Joi.string().max(500).optional().messages({
    'string.max': 'Address must be less than 500 characters',
  }),
});

export const bookSchema = Joi.object({
  isbn: Joi.string().max(20).optional().messages({
    'string.max': 'ISBN must be less than 20 characters',
  }),
  title: Joi.string().min(1).max(500).required().messages({
    'string.min': 'Title is required',
    'string.max': 'Title must be less than 500 characters',
    'any.required': 'Title is required',
  }),
  author: Joi.string().min(1).max(200).required().messages({
    'string.min': 'Author is required',
    'string.max': 'Author must be less than 200 characters',
    'any.required': 'Author is required',
  }),
  genre: Joi.string().min(1).max(100).required().messages({
    'string.min': 'Genre is required',
    'string.max': 'Genre must be less than 100 characters',
    'any.required': 'Genre is required',
  }),
  publisher: Joi.string().max(200).optional().messages({
    'string.max': 'Publisher must be less than 200 characters',
  }),
  edition: Joi.string().max(50).optional().messages({
    'string.max': 'Edition must be less than 50 characters',
  }),
  publication_year: Joi.number().integer().min(1000).max(new Date().getFullYear()).optional().messages({
    'number.base': 'Publication year must be a number',
    'number.integer': 'Publication year must be an integer',
    'number.min': 'Publication year must be after 1000',
    'number.max': 'Publication year cannot be in the future',
  }),
  description: Joi.string().max(2000).optional().messages({
    'string.max': 'Description must be less than 2000 characters',
  }),
  cover_image_url: Joi.string().uri().optional().messages({
    'string.uri': 'Cover image URL must be a valid URL',
  }),
  total_copies: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Total copies must be a number',
    'number.integer': 'Total copies must be an integer',
    'number.min': 'Total copies must be at least 1',
  }),
  barcode: Joi.string().max(100).optional().messages({
    'string.max': 'Barcode must be less than 100 characters',
  }),
  rfid_tag: Joi.string().max(100).optional().messages({
    'string.max': 'RFID tag must be less than 100 characters',
  }),
  location: Joi.string().max(100).optional().messages({
    'string.max': 'Location must be less than 100 characters',
  }),
  acquisition_date: Joi.date().optional().messages({
    'date.base': 'Acquisition date must be a valid date',
  }),
  cost: Joi.number().min(0).optional().messages({
    'number.base': 'Cost must be a number',
    'number.min': 'Cost cannot be negative',
  }),
});

export const bookSearchSchema = Joi.object({
  title: Joi.string().max(500).optional(),
  author: Joi.string().max(200).optional(),
  genre: Joi.string().max(100).optional(),
  available: Joi.boolean().optional(),
  publication_year: Joi.number().integer().min(1000).max(new Date().getFullYear()).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort_by: Joi.string().valid('title', 'author', 'publication_year', 'created_at').default('title'),
  sort_order: Joi.string().valid('asc', 'desc').default('asc'),
});

export const borrowBookSchema = Joi.object({
  book_id: Joi.string().uuid().required().messages({
    'string.guid': 'Invalid book ID format',
    'any.required': 'Book ID is required',
  }),
  due_date: Joi.date().min('now').required().messages({
    'date.base': 'Due date must be a valid date',
    'date.min': 'Due date must be in the future',
    'any.required': 'Due date is required',
  }),
  notes: Joi.string().max(500).optional().messages({
    'string.max': 'Notes must be less than 500 characters',
  }),
});

export const returnBookSchema = Joi.object({
  transaction_id: Joi.string().uuid().required().messages({
    'string.guid': 'Invalid transaction ID format',
    'any.required': 'Transaction ID is required',
  }),
  notes: Joi.string().max(500).optional().messages({
    'string.max': 'Notes must be less than 500 characters',
  }),
});

export const reservationSchema = Joi.object({
  book_id: Joi.string().uuid().required().messages({
    'string.guid': 'Invalid book ID format',
    'any.required': 'Book ID is required',
  }),
  expiry_date: Joi.date().min('now').required().messages({
    'date.base': 'Expiry date must be a valid date',
    'date.min': 'Expiry date must be in the future',
    'any.required': 'Expiry date is required',
  }),
  priority: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Priority must be a number',
    'number.integer': 'Priority must be an integer',
    'number.min': 'Priority must be at least 1',
  }),
});