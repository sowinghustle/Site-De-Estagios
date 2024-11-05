import config from '../config';
import { BadRequestError, NotFoundError } from '../config/errors';
import { buildToResult, Result } from '../config/utils';
import { DatabaseResolver } from '../database';
import hashService from '../hash/service';
import { User } from './model';

class UserService {
    async updatePasswordByEmail(
        email: string,
        newPassword: string
    ): Promise<Result<User>> {
        const toResult = buildToResult<User>();
        const encryptedPassword =
            await hashService.encryptPassword(newPassword);
        const conn = await DatabaseResolver.getConnection();
        const user = await conn.updateUserPasswordByEmail(
            email,
            encryptedPassword
        );
        const error = conn.getError();

        if (error) return toResult(error);
        if (!user) {
            const error = new NotFoundError(
                config.messages.userWithEmailNotFound
            );
            return toResult(error);
        }
        return toResult(user!);
    }

    async findUserByEmail(email: string): Promise<Result<User | undefined>> {
        const toResult = buildToResult<User | undefined>();
        const conn = await DatabaseResolver.getConnection();
        const user = await conn.findUserByEmail(email);
        const error = conn.getError();

        if (error) return toResult(error);
        return toResult(user);
    }

    async findUserById(userId: number): Promise<Result<User | undefined>> {
        const toResult = buildToResult<User | undefined>();
        const conn = await DatabaseResolver.getConnection();
        const user = await conn.findUserById(userId);
        const error = conn.getError();

        if (error) return toResult(error);
        return toResult(user);
    }

    async verifyIfEmailIsInUse(email: string): Promise<Result<boolean>> {
        const toResult = buildToResult<boolean>();
        const conn = await DatabaseResolver.getConnection();
        const isEmailInUse = await conn.verifyIfEmailIsInUse(email);
        const error = conn.getError();

        if (error) return toResult(error);
        return toResult(isEmailInUse!);
    }

    async ensureEmailIsInUse(email: string): Promise<Result<void>> {
        const toResult = buildToResult<void>();
        const result = await this.verifyIfEmailIsInUse(email);

        if (result.isError) {
            return toResult(result.value);
        }

        if (!result.value) {
            const error = new BadRequestError(
                config.messages.userWithEmailNotFound
            );
            return toResult(error);
        }

        return toResult();
    }

    async ensureEmailIsNotInUse(email: string): Promise<Result<void>> {
        const toResult = buildToResult<void>();
        const result = await this.verifyIfEmailIsInUse(email);

        if (result.isError) {
            return toResult(result.value);
        }

        if (result.value) {
            const error = new BadRequestError(
                config.messages.emailAddressIsInUse
            );
            return toResult(error);
        }

        return toResult();
    }

    async comparePassword(user: User, plainPassword: string): Promise<boolean> {
        return await hashService.comparePassword(plainPassword, user.password);
    }
}

const userService = new UserService();

export default userService;
