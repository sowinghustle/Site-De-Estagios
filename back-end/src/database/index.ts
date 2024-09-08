import { Admin, AdminCollection } from '../admin/model';
import instituition from '../config/instituition';
import { UserToken } from '../token/model';
import { User } from '../user/model';
import { SequelizeDatabaseConnection } from './sequelize/database';

export interface DatabaseConnection {
    getError(): Error | undefined;
    saveNewAdmin(admin: Admin): Promise<Admin | undefined>;
    getAdmins(): Promise<AdminCollection>;
    findUserByToken(token: string): Promise<User | undefined>;
    findAdminByNameOrEmail(nameOrEmail: string): Promise<Admin | undefined>;
    invalidateUserToken(token: string): Promise<UserToken | undefined>;
    saveNewUserToken(
        token: string,
        userid: number
    ): Promise<UserToken | undefined>;
}

export class DatabaseResolver {
    private static initialized = false;

    public static async reset() {
        this.initialized = false;
    }

    public static async getConnection(): Promise<DatabaseConnection> {
        try {
            const conn = new SequelizeDatabaseConnection();

            if (!this.initialized) {
                await conn.init();
                await conn.saveNewAdmin({
                    name: instituition.adminName,
                    user: {
                        email: instituition.adminEmail,
                        password: instituition.adminPassword,
                    },
                });

                if (conn.getError()) {
                    throw conn.getError();
                }

                this.initialized = true;
            }

            return conn;
        } catch (err) {
            const customError = err as Error;
            const message =
                'Unable to connect to database: ' + customError.message;
            customError.message = message;
            throw customError;
        }
    }
}
