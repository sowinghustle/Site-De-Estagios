import { Handler, NextFunction, Request, Response } from 'express';
import passport from 'passport';
import configurePassport from './http-bearer-auth';

export function ensureIsAuthenticated() {
    return function (req: Request, res: Response, next: NextFunction) {
        req.token = req.cookies.token;

        if (!req.headers.authorization && req.token) {
            req.headers.authorization = `Bearer ${req.token}`;
        }

        const midd = passport.authenticate('bearer', {
            session: false,
        }) as Handler;

        midd(req, res, next);
    };
}

export { configurePassport };
