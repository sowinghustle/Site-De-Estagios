import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import config from './config/project';
import buildRoutes from './routes';
import cookieParser from 'cookie-parser';
import projectConfig from './config/project';
import { configurePassport } from './auth/passport/ensure-is-auth';
import instituition from './config/instituition';
import errorMessages from './config/responseMessages';

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

app.use(session(sessionOptions));
app.use(passport.authenticate('session'));
app.use(express.json());
app.use(
    projectConfig.environment == 'production'
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
            error: errorMessages.serverError,
        });
    }
);

app.use((req, res) =>
    res.status(404).send({
        success: false,
        error: 'Não encontrado',
        stack: new Error().stack,
    })
);

export default app;
