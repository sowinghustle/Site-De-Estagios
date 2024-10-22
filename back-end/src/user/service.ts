import config from '../config';
import { BadRequestError } from '../config/errors';
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

    async ensureEmailIsNotInUse(email: string): Promise<Result<void>> {
        const toResult = buildToResult<void>();
        const conn = await DatabaseResolver.getConnection();
        const isEmailInUse = await conn.verifyIfEmailIsInUse(email);
        const error = conn.getError();

        if (error) {
            return toResult(error);
        }

        if (isEmailInUse) {
            const error = new BadRequestError(
                config.messages.emailAddressIsInUse
            );
            return toResult(error);
        }

        return toResult();
    }
}

const userService = new UserService();

export default userService;
