import Joi from 'joi';
import config from '../config';

export const AdminLoginSchema = Joi.object<{
    nameOrEmail: string;
    password: string;
}>({
    nameOrEmail: Joi.string()
        .lowercase()
        .required()
        .when(Joi.string().email(), {
            then: Joi.string()
                .max(config.validations.maxEmailLength)
                .messages({
                    'string.email': config.messages.invalidEmail,
                    'string.max': `O email deve ter no máximo ${config.validations.maxEmailLength} caracteres.`,
                }),
            otherwise: Joi.string()
                .pattern(/^[a-zA-Z ]+$/)
                .messages({
                    'string.pattern.base': config.messages.nameOnlyLetters,
                }),
        })
        .messages({
            'any.required': config.messages.emptyNameOrEmail,
            'alternatives.match':
                'Por favor, forneça um nome ou um email válido.',
        }),
    password: Joi.string()
        .min(config.validations.minPasswordLength)
        .required()
        .messages({
            'string.min': config.messages.insuficientPasswordCharacters,
            'any.required': config.messages.emptyPassword,
        }),
});
