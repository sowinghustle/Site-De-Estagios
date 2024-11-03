import { NextFunction, Request, Response } from 'express';
import authService from '../auth/service';
import { UnauthorizedError } from '../config/errors';

export default class LogoutController {
    async logout(req: Request, res: Response, next: NextFunction) {
        if (req.isUnauthenticated()) {
            throw new UnauthorizedError();
        }

        const logoutResult = await authService.invalidateAccessToken(
            req.token!
        );

        if (logoutResult.isError) {
            throw logoutResult.value;
        }

        req.logout((err) => {
            if (err) return next(err);
            res.clearCookie('connect.sid');
            res.clearCookie('token');
            req.session.destroy(() => res.sendStatus(204));
        });
    }
}
