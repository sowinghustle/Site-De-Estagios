import { NextFunction, Request, Response } from 'express';
import { mapUserToJson as mapUserToData } from './model';
import userService from './service';

export default class UserController {
    async me(req: Request, res: Response, next: NextFunction) {
        if (!req.user) {
            return res.status(400).send({
                success: false,
                message: 'Você precisa estar logado para acessar este recurso.',
            });
        }

        const user = (await userService.findUserById(req.user)).orElseThrow();

        if (user) {
            return res.send({
                success: true,
                user: mapUserToData(user),
            });
        }

        req.logOut((err) => {
            if (!err) {
                return res.status(404).send({
                    success: false,
                    message:
                        'Ocorreu um problema e não foi possível obter seus dados. Faça login novamente.',
                });
            }
            return next(err);
        });
    }
}
