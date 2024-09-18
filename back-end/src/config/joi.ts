import Joi from 'joi';
import config from '.';

export const NameSchema = Joi.string()
    .pattern(/^[a-zA-Z ]+$/)
    .messages({
        'string.pattern.base': config.messages.nameOnlyLetters,
    });

export const EmailSchema = Joi.string()
    .email()
    .max(config.validations.maxEmailLength)
    .messages({
        'string.email': config.messages.invalidEmail,
        'string.max': `O email deve ter no máximo ${config.validations.maxEmailLength} caracteres.`,
    });

export const NameOrEmailSchema = Joi.string()
    .lowercase()
    .when(Joi.string().email(), {
        then: EmailSchema,
        otherwise: NameSchema,
    })
    .messages({
        'any.required': config.messages.emptyNameOrEmail,
        'alternatives.match': 'Por favor, forneça um nome ou um email válido.',
    });

export const PasswordSchema = Joi.string()
    .min(config.validations.minPasswordLength)
    .messages({
        'string.min': config.messages.insuficientPasswordCharacters,
        'any.required': config.messages.emptyPassword,
    });

export const RepeatPasswordSchema = Joi.any()
    .equal(Joi.ref('password'))
    .label('Confirmar senha')
    .options({
        messages: { 'any.only': 'A confirmação de senha está incorreta' },
    });
