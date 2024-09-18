import Joi from 'joi';
import config from '.';

export const NameSchema = Joi.string()
    .pattern(/^[a-zA-Z ]+$/)
    .required()
    .messages({
        'string.pattern.base': config.messages.nameOnlyLetters,
    });

export const EmailSchema = Joi.string()
    .email()
    .max(config.validations.maxEmailLength)
    .required()
    .messages({
        'any.required': config.messages.emptyEmail,
        'string.empty': config.messages.emptyEmail,
        'string.email': config.messages.invalidEmail,
        'string.max': `O email deve ter no máximo ${config.validations.maxEmailLength} caracteres.`,
    });

export const NameOrEmailSchema = Joi.string()
    .lowercase()
    .when(Joi.string().email(), {
        then: EmailSchema,
        otherwise: NameSchema,
    })
    .required()
    .messages({
        'any.required': config.messages.emptyNameOrEmail,
        'string.empty': config.messages.emptyNameOrEmail,
        'alternatives.match': 'Por favor, forneça um nome ou um email válido.',
    });

export const PasswordSchema = Joi.string()
    .min(config.validations.minPasswordLength)
    .required()
    .messages({
        'any.required': config.messages.emptyPassword,
        'string.empty': config.messages.emptyPassword,
        'string.min': config.messages.insuficientPasswordCharacters,
    });

export const RepeatPasswordSchema = Joi.any()
    .equal(Joi.ref('password'))
    .label('Confirmar senha')
    .required()
    .options({
        messages: { 'any.only': 'A confirmação de senha está incorreta' },
    });
