import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { DatabaseResolver } from '../database';
import * as authService from '../auth/service';

type CreateUserDto = {
    username: string;
    email: string;
    password: string;
};

type UpdateUserDto = {
    username: string;
    email: string;
};

export class UserController {
    async index(req: Request, res: Response) {
        const db = await DatabaseResolver.getDatabase();
        const users = await db.getUsers();

        if (db.getError()) {
            return res.send({
                success: false,
                error: db.getError()!.message,
            });
        }

        return res.send({
            success: true,
            users,
        });
    }
    async createUser(req: Request, res: Response) {
        const data: CreateUserDto = req.body;
        const db = await DatabaseResolver.getDatabase();
        const user = await db.saveNewUser({
            ...data,
            id: 0,
            token: randomUUID(),
        });

        if (user === null) {
            if (db.getError())
                return res.send({
                    success: false,
                    error: db.getError()!.message,
                });

            throw new Error(
                'Não foi possível salvar ou obter as informações do usuário.'
            );
        }

        authService.saveUserToken(res, user.token);

        return res.send({
            success: true,
            user,
        });
    }
    async getUser(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.send({
                success: false,
                error: 'O ID do usuário precisa ser um número válido.',
            });
        }

        const db = await DatabaseResolver.getDatabase();
        const user = await db.getUserById(id);

        if (user === null) {
            if (db.getError()) {
                return res.send({
                    success: false,
                    error: db.getError()!.message,
                });
            }

            return res.send({
                success: false,
                error: `Um usuário com ID ${id} não foi encontrado.`,
            });
        }

        return res.send({
            success: true,
            user,
        });
    }
    async updatedUser(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.send({
                success: false,
                error: 'O ID do usuário precisa ser um número válido.',
            });
        }

        throw new Error('Not implemented');
    }
    async deleteUser(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.send({
                success: false,
                error: 'O ID do usuário precisa ser um número válido.',
            });
        }

        const db = await DatabaseResolver.getDatabase();
        const userWasDeleted = await db.deleteUser(id);

        if (!userWasDeleted) {
            if (db.getError())
                return res.send({
                    success: false,
                    error: db.getError()!.message,
                });

            return res.send({
                success: false,
                error: `Não foi possível excluir o usuário com ID ${id}`,
            });
        }

        return res.send({
            success: true,
        });
    }
}
