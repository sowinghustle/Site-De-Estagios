import RedisStore from 'connect-redis';
import { randomUUID } from 'crypto';
import { CookieOptions } from 'express';
import { Store } from 'express-session';
import Redis from 'ioredis';

type Environment = 'development' | 'test' | 'production';

const config = Object.freeze({
    messages: {
        // validation
        adminNotFoundWithNameOrEmail:
            'Administrador não encontrado com este nome ou email.',
        supervisorNotFoundWithEmail: 'Orientador não encontrado com este email',
        studentNotFoundWithEmail:
            'Não foi encontrado nenhum aluno com este email',
        emptyEmail: 'O campo email é obrigatório.',
        emptyNameOrEmail: 'O campo nome ou email é obrigatório.',
        emptyPassword: 'O campo senha é obrigatório.',
        insuficientPasswordCharacters:
            'A senha deve ter pelo menos 8 caracteres.',
        invalidEmail: 'Este não é um email válido',
        emailAddressIsInUse: 'Este email já está em uso',
        userWithEmailNotFound:
            'Não foi encontrado nenhum usuário com este email',
        invalidAdminName: 'O nome do admin deve conter apenas letras e números',
        nameOnlyLetters: 'O campo nome só pode ter letras.',
        wrongRepeatPassword: 'A confirmação de senha está incorreta',
        wrongPassword: 'A senha está incorreta!',

        // good
        successfullLogin: 'Login realizado com sucesso!',
        successfullRegister: 'Cadastro realizado com sucesso!',
        welcomeMessage: 'Servidor ativo. API está disponível.',

        // bad
        databaseImplNotDefined:
            'A implementação do banco de dados não foi definida.',
        routeNotFound: 'Este recurso não foi encontrado.',
        serverUnhandledException:
            'Não foi possível completar a requisição porque ocorreu um erro inesperado!',
        tooManyRequests:
            'Muitas requisições foram enviadas em pouco tempo. Aguarde alguns minutos para continuar.',
        notAuth: 'Você precisa estar autenticado para acessar este recurso!',
        invalidAccessToken:
            'Seu acesso não é válido! Tente fazer o login novamente.',
        invalidToken: 'Este token não é válido!',
    },
    validations: {
        minPasswordLength: 8,
        maxEmailLength: 254,
    },
    instituition: {
        adminName: 'admin',
        adminEmail: 'admin@email.com',
        adminPassword: 'adminPassword123*',
    },
    project: (() => {
        const config = {
            environment: 'production' as Environment,
            port: Number(process.env.PORT || '8000'),
            secret: process.env.secret || randomUUID(),
            frontendUrl: process.env.FRONTEND_URL ?? '',
            redisUrl: process.env.REDIS_URL,
            emailOptions: {
                host: process.env.EMAIL_HOST,
                port: Number(process.env.EMAIL_PORT),
                sender: process.env.EMAIL_SENDER,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            },
        };

        if (process.env.TS_NODE_DEV || process.env.NODE_ENV === 'development') {
            config.environment = 'development';
        }

        if (process.env.NODE_ENV === 'test') {
            config.environment = 'test';
        }

        const cookieOptions: CookieOptions = {
            maxAge: 1000 * 60 * 30,
            httpOnly: true,
            signed: false,
        };

        if (config.environment == 'production') {
            cookieOptions.signed = true;
            cookieOptions.secure = true;
            cookieOptions.sameSite = 'strict';
        }

        return {
            ...config,
            cookieOptions,
        };
    })(),
    external: {
        get redisStore(): Store {
            const redisClient = new Redis(config.project.redisUrl as string);

            return new RedisStore({
                client: redisClient,
                prefix: 'session:',
            });
        },
        get logger(): (message?: any, ...optionalParams: any[]) => void {
            return (message, ...optionalParams) => {
                console.log('=>', message, ...optionalParams);
            };
        },
    },
});

export default config;
