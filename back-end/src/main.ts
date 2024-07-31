import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import config from './config/project';
import configureRoutes from './routes';
import { configurePassport } from './auth/passport';
import cookieParser from 'cookie-parser';
import projectConfig from './config/project';
import { DatabaseResolver } from './database';

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

app.use('/api/v1', configureRoutes());
app.use(
    (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        if (err) {
            const error = err as Error;

            if (config.environment != 'production') {
                return res.status(500).send({
                    success: false,
                    error: error.message,
                    stack: error.stack,
                });
            }

            return res.status(500).send({
                success: false,
                error: 'Não foi possível completar a requisição porque ocorreu um erro inesperado!',
            });
        }

        return next();
    }
);
app.use((req, res) =>
    res.status(404).send({
        success: false,
        error: 'Não encontrado',
        stack: new Error().stack,
    })
);
app.listen(config.port, async () => {
    await DatabaseResolver.testDatabaseConnection();
    console.log('Server running at port ' + config.port);
});
