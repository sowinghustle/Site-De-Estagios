import hashService from '../hash/service';
import { User } from './model';

class UserService {
    async compareUserPasswords(
        user: User,
        plainPassword: string
    ): Promise<boolean> {
        return await hashService.comparePassword(plainPassword, user.password);
    }
}

const userService = new UserService();

export default userService;
