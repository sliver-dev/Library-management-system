import Joi from 'joi';
export declare const validate: (schema: Joi.ObjectSchema, data: any) => {
    error: Joi.ValidationError | undefined;
    value: any;
};
export declare const emailSchema: Joi.StringSchema<string>;
export declare const passwordSchema: Joi.StringSchema<string>;
export declare const nameSchema: Joi.StringSchema<string>;
export declare const phoneSchema: Joi.StringSchema<string>;
export declare const roleSchema: Joi.StringSchema<string>;
export declare const uuidSchema: Joi.StringSchema<string>;
//# sourceMappingURL=validation.d.ts.map