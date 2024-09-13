import { randomUUID } from 'crypto';

type Environment = 'development' | 'test' | 'production';

const config = Object.freeze({
    messages: {
        // good
        successfullLogin: 'Login realizado com sucesso!',
        welcomeMessage: 'Bem vindo.',
        // bad
        databaseImplNotDefined:
            'A implementação do banco de dados não foi definida.',
        routeNotFound: 'Este recurso não foi encontrado.',
        serverUnhandledException:
            'Não foi possível completar a requisição porque ocorreu um erro inesperado!',
        tooManyRequests:
            'Muitas requisições foram enviadas em pouco tempo. Aguarde alguns minutos para continuar.',
        notAuth: 'Você precisa estar autenticado para acessar este recurso!',
        invalidToken: 'Seu acesso não é válido! Tente fazer o login novamente.',
        // validation
        adminNotFoundWithNameOrEmail:
            'Administrador não encontrado com este nome ou email.',
        emptyNameOrEmail: 'O campo nome ou email é obrigatório.',
        emptyPassword: 'O campo senha é obrigatório.',
        insuficientPasswordCharacters:
            'A senha deve ter pelo menos 8 caracteres.',
        invalidEmail: 'Este não é um email válido',
        nameOnlyLetters: 'O campo nome só pode ter letras.',
        wrongPassword: 'A senha está incorreta!',
    },
    validations: {
        minPasswordLength: 8,
        minNameLength: 3,
        maxEmailLength: 254,
    },
    instituition: {
        adminName: 'admin',
        adminEmail: 'admin@email.com',
        adminPassword: randomUUID(),
    },
    project: (() => {
        const config = {
            environment: 'production' as Environment,
            port: Number(process.env.PORT || '8000'),
            secret: process.env.secret || randomUUID(),
        };

        if (process.env.TS_NODE_DEV) {
            config.environment = 'development';
        }

        if (process.env.NODE_ENV === 'test') {
            config.environment = 'test';
        }

        return config;
    })(),
});

export default config;
