import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema, data: any) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  return { error, value };
};

export const emailSchema = Joi.string().email().required().messages({
  'string.email': 'Please enter a valid email address',
  'any.required': 'Email is required',
});

export const passwordSchema = Joi.string()
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

export const nameSchema = Joi.string().min(2).max(50).required().messages({
  'string.min': 'Name must be at least 2 characters long',
  'string.max': 'Name must be less than 50 characters long',
  'any.required': 'Name is required',
});

export const phoneSchema = Joi.string().pattern(/^[+]?[\d\s\-()]{10,20}$/).optional().messages({
  'string.pattern.base': 'Please enter a valid phone number',
});

export const roleSchema = Joi.string().valid('admin', 'user').default('user');

export const uuidSchema = Joi.string().uuid().required().messages({
  'string.guid': 'Invalid ID format',
  'any.required': 'ID is required',
});