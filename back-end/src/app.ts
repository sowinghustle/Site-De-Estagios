import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import config from './config/project';
import buildRoutes from './routes';
import cookieParser from 'cookie-parser';
import project from './config/project';
import { configurePassport } from './auth/passport/ensure-is-auth';
import respMessages from './config/responseMessages';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

const app = express();
const sessionOptions: session.SessionOptions = {
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
    },
};

if (config.environment == 'production') {
    app.set('trust proxy', 1);
    sessionOptions.cookie!.secure = false;
}

if (project.environment === 'production') {
    app.use(
        slowDown({
            // a partir de 100 requisições em menos de 10 minutos, dá um delay de 1 segundo
            // que aumenta em 1 para cada 50 requisições a mais que forem recebidas
            windowMs: 10 * 60 * 1000,
            delayAfter: 100,
            delayMs: (heats) => (heats / 50) * 1000,
        })
    );

    app.use(
        rateLimit({
            // permite até 1125 requisições a cada 15 minutos
            windowMs: 15 * 60 * 1000,
            limit: 1125,
            legacyHeaders: true,
            handler(req, res) {
                res.status(429).send({
                    success: false,
                    message: respMessages.tooManyRequests,
                });
            },
        })
    );
}

app.use(
    helmet({
        frameguard: { action: 'deny' }, // Clickjacking
        hidePoweredBy: true, // X-Powered-By (Filtragem do cabeçalho)
        hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }, // Forçar sempre conexões HTTPS
        noSniff: true, // Prevenção contra scripts
        referrerPolicy: { policy: 'no-referrer-when-downgrade' }, // Cabeçalho Referer (Desabilitado)
        xssFilter: true, // XSS
    })
);

app.use(session(sessionOptions));
app.use(passport.authenticate('session'));
app.use(express.json());
app.use(
    project.environment == 'production'
        ? cookieParser(config.secret)
        : cookieParser()
);
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: [
            config.environment != 'production' ? 'http://localhost:8000' : '',
        ],
    })
);

configurePassport();

app.use('/api/v1', buildRoutes());
app.use(
    (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        if (!err) return next();

        const error = err as Error;

        if (config.environment !== 'production') {
            return res.status(500).send({
                success: false,
                message: error.message,
                stack: error.stack,
            });
        }

        return res.status(500).send({
            success: false,
            message: respMessages.serverError,
        });
    }
);

app.use((req, res) =>
    res.status(404).send({
        success: false,
        message: 'Não encontrado',
        stack: new Error().stack,
    })
);

export default app;
