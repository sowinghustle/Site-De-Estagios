import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import slowDown from 'express-slow-down';
import helmet from 'helmet';
import passport from 'passport';
import validator from 'validator';
import { configurePassport } from './auth/passport/ensure-is-auth';
import { default as config, default as project } from './config/project';
import respMessages from './config/responseMessages';
import buildRoutes from './routes';

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
        frameguard: { action: 'deny' },
        hidePoweredBy: true,
        hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
        noSniff: true,
        referrerPolicy: { policy: 'no-referrer-when-downgrade' }, // Cabeçalho Referer (Desabilitado)
        xssFilter: true,
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

app.use((req, res, next) => {
    if (req.body) {
        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = validator.trim(req.body[key]);
                req.body[key] = validator.escape(req.body[key]);
            }
        }
    }
    next();
});

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
