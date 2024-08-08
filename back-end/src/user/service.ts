import { randomUUID } from 'crypto';
import { DatabaseResolver } from '../database';
import { CreateUserDto, UpdateUserDto } from './dto';

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
    async updateUser(data: UpdateUserDto) {
        const db = await DatabaseResolver.getDatabase();
        const findResult = await this.findById(data.id);

        if (!findResult.user)
            return {
                error: findResult.error,
            };

        const user = await db.updateUser({
            ...findResult.user,
            ...data,
        });

        return { user };
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
