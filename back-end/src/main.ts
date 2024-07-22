import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import config from './config/project-config';
import configureRoutes from './routes';
import { configurePassport } from './auth/passport';
import cookieParser from 'cookie-parser';
import projectConfig from './config/project-config';

const app = express();
const sessionOptions: session.SessionOptions = {
    secret: '...',
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
        ? cookieParser('...')
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
app.use((req, res) => res.status(404));
app.listen(config.port, () => {
    console.log('Server running at port ' + config.port);
});
