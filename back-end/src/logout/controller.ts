import { NextFunction, Request, Response } from 'express';
import logoutService from './service';

export default class LogoutController {
    async logout(req: Request, res: Response, next: NextFunction) {
        const logoutError = await logoutService.handle(req.token!);

        if (logoutError) {
            return next(logoutError);
        }

        req.logOut((err) => {
            if (err) return next(err);
            return res.status(204).end();
        });
    }
}
