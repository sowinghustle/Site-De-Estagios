import { NextFunction, Request, Response } from 'express';
import logoutService from './service';

export default class LogoutController {
    async logout(req: Request, res: Response, next: NextFunction) {
        const error = await logoutService.handle(req.token!);

        if (error) {
            return next(error);
        }

        req.logOut((err) => {
            if (err) return next(err);
            return res.status(204).end();
        });
    }
}
