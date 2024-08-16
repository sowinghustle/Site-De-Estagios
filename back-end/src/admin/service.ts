import { DatabaseResolver } from '../database';

export class AdminService {
    async findAdminByNameOrEmailAndPassword(
        nameOrEmail: string,
        password: string
    ) {
        const db = await DatabaseResolver.getDatabase();
        const admin = await db.findAdminByNameOrEmail(nameOrEmail);

        if (!admin) {
            return {
                error: db.getError()!,
            };
        }

        if (admin.user.password == password) {
            return {
                error: new Error('A senha está incorreta!'),
            };
        }

        return { admin };
    }
}

const adminService = new AdminService();

export default adminService;
