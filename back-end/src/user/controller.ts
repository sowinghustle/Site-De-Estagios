import { NextFunction, Request, Response } from 'express';
import { mapUserToJson as mapUserToData } from './model';

export default class UserController {
    async me(req: Request, res: Response, next: NextFunction) {
        return res.send({
            success: true,
            user: mapUserToData(req.user!),
        });
    }
}
