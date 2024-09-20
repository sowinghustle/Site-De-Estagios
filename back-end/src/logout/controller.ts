import { NextFunction, Request, Response } from 'express';
import logoutService from './service';

export default class LogoutController {
    async logout(req: Request, res: Response, next: NextFunction) {
        const logoutResult = await logoutService.handle(req.token!);

        if (logoutResult.isError) {
            return next(logoutResult.value);
        }

        req.logOut((err) => {
            if (!err) return res.status(204).end();
            return next(err);
        });
    }
}
