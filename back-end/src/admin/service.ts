import responseMessages from '../config/responseMessages';
import { DatabaseResolver } from '../database';
import { ServiceResult } from '../utils/service-result';
import { Admin } from './model';

export class AdminService {
    async findAdminByNameOrEmailAndPassword(data: {
        nameOrEmail: string;
        password: string;
    }): Promise<ServiceResult<{ admin: Admin }>> {
        const conn = await DatabaseResolver.getConnection();
        const admin = await conn.findAdminByNameOrEmail(data.nameOrEmail);

        if (!admin) {
            const error = conn.getError()!;
            return { error };
        }

        if (admin.user.password !== data.password) {
            return {
                error: new Error(responseMessages.wrongPassword),
            };
        }

        return { admin };
    }
}

const adminService = new AdminService();

export default adminService;
