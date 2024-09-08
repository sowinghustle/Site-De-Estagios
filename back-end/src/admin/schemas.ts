import Joi from 'joi';
import respMessages from '../config/responseMessages';
import validation from '../config/validation';

export const AdminLoginSchema = Joi.object({
    nameOrEmail: Joi.string()
        .lowercase()
        .trim()
        .required()
        .when(Joi.string().email(), {
            then: Joi.string()
                .max(validation.maxEmailLength)
                .messages({
                    'string.email': 'O email deve ser um email válido.',
                    'string.max': `O email deve ter no máximo ${validation.maxEmailLength} caracteres.`,
                }),
            otherwise: Joi.string()
                .pattern(/^[a-zA-Z ]+$/)
                .messages({
                    'string.pattern.base': respMessages.nameOnlyLetters,
                }),
        })
        .messages({
            'any.required': respMessages.emptyNameOrEmail,
            'alternatives.match':
                'Por favor, forneça um nome ou um email válido.',
        }),
    password: Joi.string()
        .min(validation.minPasswordLength)
        .trim()
        .required()
        .messages({
            'string.min': respMessages.insuficientPasswordCharacters,
            'any.required': respMessages.emptyPassword,
        }),
});
