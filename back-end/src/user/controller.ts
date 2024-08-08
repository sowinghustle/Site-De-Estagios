import { Request, Response } from 'express';
import { DatabaseResolver } from '../database';
import authService from '../auth/service';
import userService from './service';
import { UpdateUserDto } from './dto';

export default class UserController {
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
    async create(req: Request, res: Response) {
        const { user, error } = await userService.createUser(req.body);

        if (error) {
            return res.send({
                success: false,
                error: error.message,
            });
        }

        if (!user) {
            throw new Error(
                'Ocorreu um erro inesperado ao salvar ou obter as informações do usuário.'
            );
        }

        authService.saveUserToken(user, res.cookie.bind(res, 'token'));

        return res.send({
            success: true,
            user,
        });
    }
    async update(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.send({
                success: false,
                error: 'O ID do usuário precisa ser um número válido.',
            });
        }

        const data: UpdateUserDto = { id, ...req.body };
        const { error, user } = await userService.updateUser(data);

        if (error) {
            return res.send({
                success: false,
                error: error.message,
            });
        }

        if (!user) {
            return res.send({
                success: false,
                error: `Não foi possível atualizar o usuário.`,
            });
        }

        return res.send({
            success: true,
            user,
        });
    }
    async findById(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.send({
                success: false,
                error: 'O ID do usuário precisa ser um número válido.',
            });
        }

        const { user, error } = await userService.findById(id);

        if (error) {
            return res.send({
                success: false,
                error: error.message,
            });
        }

        if (!user) {
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
    async delete(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.send({
                success: false,
                error: 'O ID do usuário precisa ser um número válido.',
            });
        }

        const { userWasDeleted, error } = await userService.deleteById(id);

        if (error) {
            return res.send({
                success: false,
                error: error.message,
            });
        }

        if (!userWasDeleted) {
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
