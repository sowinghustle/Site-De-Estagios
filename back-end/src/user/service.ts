import { randomUUID } from 'crypto';
import { DatabaseResolver } from '../database';
import { CreateUserDto } from './model';

export class UserService {
    async createUser(data: CreateUserDto) {
        const db = await DatabaseResolver.getDatabase();
        const user = await db.saveNewUser({
            ...data,
            id: 0,
            token: randomUUID(),
        });

        return {
            user,
            error: db.getError(),
        };
    }
    async findById(id: number) {
        const db = await DatabaseResolver.getDatabase();
        const user = await db.getUserById(id);

        return {
            user,
            error: db.getError(),
        };
    }
    async deleteById(id: number) {
        const db = await DatabaseResolver.getDatabase();
        const userWasDeleted = await db.deleteUser(id);

        return {
            userWasDeleted,
            error: db.getError(),
        };
    }
}

const userService = new UserService();

export default userService;
