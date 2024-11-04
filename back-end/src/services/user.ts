import { User } from '../models/user';
import config from '../modules/config';
import { BadRequestError, NotFoundError } from '../modules/config/errors';
import { DatabaseResolver } from '../modules/database';
import hashService from './hash';

class UserService {
    async updatePasswordByEmail(
        email: string,
        newPassword: string
    ): Promise<User> {
        const conn = await DatabaseResolver.getConnection();
        const user = await conn.updateUserPasswordByEmail(
            email,
            await hashService.encryptPasswordAsync(newPassword)
        );

        conn.throwIfHasError();

        if (!user) {
            throw new NotFoundError(config.messages.userWithEmailNotFound);
        }

        return user;
    }

    async findUserByEmail(email: string): Promise<User | undefined> {
        const conn = await DatabaseResolver.getConnection();
        const user = await conn.findUserByEmail(email);

        conn.throwIfHasError();

        return user;
    }

    async findUserById(userId: number): Promise<User | undefined> {
        const conn = await DatabaseResolver.getConnection();
        const user = await conn.findUserById(userId);

        conn.throwIfHasError();

        return user;
    }

    async verifyIfEmailIsInUse(email: string): Promise<boolean> {
        const conn = await DatabaseResolver.getConnection();
        const isEmailInUse = await conn.verifyIfEmailIsInUse(email);

        conn.throwIfHasError();

        return isEmailInUse!;
    }

    async ensureEmailIsInUse(email: string): Promise<void> {
        const isEmailInUse = await this.verifyIfEmailIsInUse(email);
        if (isEmailInUse) return;
        throw new BadRequestError(config.messages.userWithEmailNotFound);
    }

    async ensureEmailIsNotInUse(email: string): Promise<void> {
        const isEmailInUse = await this.verifyIfEmailIsInUse(email);
        if (!isEmailInUse) return;
        throw new BadRequestError(config.messages.emailAddressIsInUse);
    }

    async comparePasswordsAsync(
        user: User,
        plainPassword: string
    ): Promise<boolean> {
        return await hashService.comparePasswordsAsync(
            plainPassword,
            user.password
        );
    }
}

const userService = new UserService();

export default userService;
