import passport from "passport";
import configurePassport from "./http-bearer-auth";
import { Request, Response, NextFunction, Handler } from "express";

export function authenticate() {
    return function (req: Request, res: Response, next: NextFunction) {
        const cookieToken = req.cookies.token;

        if (!req.headers.authorization)
            req.headers.authorization = `Bearer ${cookieToken}`;

        const midd = passport.authenticate("bearer", { session: false }) as Handler;
        midd(req, res, next);
    };
}

export { configurePassport };
