import config from '../config';
import { ResultOrErrorObject } from '../config/utils';
import { DatabaseResolver } from '../database';
import { Admin } from './model';

export class AdminService {
    async findAdminByNameOrEmailAndPassword(data: {
        nameOrEmail: string;
        password: string;
    }): Promise<ResultOrErrorObject<{ admin: Admin }>> {
        const conn = await DatabaseResolver.getConnection();
        const admin = await conn.findAdminByNameOrEmail(data.nameOrEmail);

        if (!admin) {
            return { error: conn.getError()! };
        }

        if (admin.user.password !== data.password) {
            return {
                error: new Error(config.messages.wrongPassword),
            };
        }

        return { admin };
    }
}

const adminService = new AdminService();

export default adminService;
