import { buildToResult, Result } from '../config/utils';
import { DatabaseResolver } from '../database';
import hashService from '../hash/service';
import { User } from './model';

class UserService {
    async comparePassword(user: User, plainPassword: string): Promise<boolean> {
        return await hashService.comparePassword(plainPassword, user.password);
    }

    async findUserById(userId: number): Promise<Result<User | undefined>> {
        const toResult = buildToResult<User | undefined>();
        const conn = await DatabaseResolver.getConnection();
        const user = await conn.findUserById(userId);
        const error = conn.getError();

        if (error) {
            return toResult(error);
        }

        return toResult(user);
    }
}

const userService = new UserService();

export default userService;
