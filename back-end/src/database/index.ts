import config from '../config/project';
import instituition from '../config/instituition';
import { Admin, AdminCollection } from '../admin/model';
import { SequelizeDatabase } from './sequelize/database';
import { User } from '../user/model';
import { UserToken } from '../token/model';

export interface Database {
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
    static async getDatabase(): Promise<Database> {
        if (config.environment === 'development') {
            return new SequelizeDatabase();
        }

        throw new Error('Database implementation not created.');
    }

    static async initDatabase() {
        const db = await DatabaseResolver.getDatabase();

        try {
            if (db instanceof SequelizeDatabase) {
                SequelizeDatabase.init();
                await SequelizeDatabase.sync();
                await db.authenticate();
            }

            await db.saveNewAdmin({
                name: 'admin',
                user: {
                    email: instituition.adminEmail,
                    password: instituition.adminPassword,
                },
            });

            if (db.getError()) {
                throw db.getError();
            }

            console.log(await db.getAdmins());
        } catch (err) {
            const customError = err as Error;
            const message =
                'Unable to connect to database: ' + customError.message;
            customError.message = message;
            throw customError;
        }
    }
}
