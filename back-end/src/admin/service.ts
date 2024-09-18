import { buildToResult, Result } from '../config/utils';
import { DatabaseResolver } from '../database';
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
}

const adminService = new AdminService();

export default adminService;
