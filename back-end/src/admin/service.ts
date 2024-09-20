import { buildToResult, Result } from '../config/utils';
import { DatabaseResolver } from '../database';
import hashService from '../hash/service';
import { Admin } from './model';

export class AdminService {
    async findAdminByNameOrEmail(
        nameOrEmail: string
    ): Promise<Result<Admin | undefined>> {
        const toResult = buildToResult<Admin | undefined>();
        const conn = await DatabaseResolver.getConnection();
        const admin = await conn.findAdminByNameOrEmail(nameOrEmail);
        const error = conn.getError();

        if (error) {
            return toResult(error);
        }

        return toResult(admin);
    }

    async saveNewAdmin(admin: Admin) {
        const toResult = buildToResult<Admin>();
        const conn = await DatabaseResolver.getConnection();
        const encryptedPassword = await hashService.encryptPassword(
            admin.user.password
        );
        const createdAdmin = await conn.saveNewAdmin({
            ...admin,
            user: {
                ...admin.user,
                password: encryptedPassword,
            },
        });
        const error = conn.getError();

        if (error) {
            return toResult(error);
        }

        return toResult(createdAdmin!);
    }
}

const adminService = new AdminService();

export default adminService;
