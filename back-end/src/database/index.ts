import config from '../config/project';
import { User, UserCollection } from '../user/model';
import { InMemorySequelizeDatabase } from './sequelize/in-memory-database';

export interface Database {
    getError(): Error | null;
    saveNewUser(user: User): Promise<User | null>;
    updateUser(user: User): Promise<User | null>;
    getUserById(id: number): Promise<User | null>;
    deleteUser(id: number): Promise<boolean>;
    getUsers(): Promise<UserCollection>;
}

export class DatabaseResolver {
    static async getDatabase(): Promise<Database> {
        if (config.environment === 'development') {
            return new InMemorySequelizeDatabase();
        }

        throw new Error('Database implementation not created.');
    }

    static async testDatabaseConnection() {
        const db = await DatabaseResolver.getDatabase();

        try {
            if (db instanceof InMemorySequelizeDatabase) {
                InMemorySequelizeDatabase.init();
                InMemorySequelizeDatabase.sync();
                await db.authenticate();
            }
        } catch (err) {
            const customError = err as Error;
            const message =
                'Unable to connect to database: ' + customError.message;
            customError.message = message;
            throw customError;
        }
    }
}
