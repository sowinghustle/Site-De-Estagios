import { Admin, AdminCollection } from '../admin/model';
import instituitionConfig from '../config/instituition';
import config from '../config/project';
import { User, UserCollection } from '../user/model';
import { InMemorySequelizeDatabase } from './sequelize/in-memory-database';

export interface Database {
    getError(): Error | null;
    saveNewUser(user: User): Promise<User | null>;
    updateUser(user: User): Promise<User | null>;
    getUserById(id: number): Promise<User | null>;
    getUserByToken(token: string): Promise<User | null>;
    deleteUser(id: number): Promise<boolean>;
    getUsers(): Promise<UserCollection>;
    saveNewAdmin(admin: Admin): Promise<Admin | null>;
    getAdmins(): Promise<AdminCollection>;
}

export class DatabaseResolver {
    static async getDatabase(): Promise<Database> {
        if (config.environment === 'development') {
            return new InMemorySequelizeDatabase();
        }

        throw new Error('Database implementation not created.');
    }

    static async initDatabase() {
        const db = await DatabaseResolver.getDatabase();

        try {
            if (db instanceof InMemorySequelizeDatabase) {
                InMemorySequelizeDatabase.init();
                InMemorySequelizeDatabase.sync();
                await db.authenticate();
            }

            await db.saveNewAdmin({
                id: 0,
                email: instituitionConfig.adminEmail,
                password: instituitionConfig.adminPassword,
                tokens: [],
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
