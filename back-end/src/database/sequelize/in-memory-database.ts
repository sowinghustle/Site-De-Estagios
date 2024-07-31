import { Database } from '..';
import { User, UserCollection } from '../../user/model';
import { DataTypes, Sequelize } from 'sequelize';
import { SequelizeUser } from './user';

export class InMemorySequelizeDatabase implements Database {
    private static sequelize: Sequelize;

    private get sequelize(): Sequelize {
        return InMemorySequelizeDatabase.sequelize;
    }

    static init() {
        const sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
        });

        SequelizeUser.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                },
                username: DataTypes.STRING,
                email: DataTypes.STRING,
                password: DataTypes.STRING,
                token: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null,
                },
            },
            {
                sequelize,
                modelName: 'User',
                tableName: 'users',
                underscored: true,
            }
        );

        this.sequelize = sequelize;
    }

    static sync() {
        this.sequelize.sync({ force: true });
    }

    async deleteUser(id: number): Promise<boolean> {
        try {
            const user = await SequelizeUser.findByPk(id);

            if (!user) {
                throw new Error('Usuário não encontrado!');
            }

            await user.destroy();
            return true;
        } catch (err) {
            this.error = err as Error;
            return false;
        }
    }

    async getUsers(): Promise<UserCollection> {
        try {
            return await SequelizeUser.findAll();
        } catch (err) {
            this.error = err as Error;
            return [];
        }
    }

    async saveNewUser(user: User): Promise<User | null> {
        try {
            const model = await SequelizeUser.create({
                username: user.username,
                email: user.email,
                password: user.password,
            });

            return model;
        } catch (err) {
            this.error = err as Error;
            return null;
        }
    }

    async getUserById(id: number): Promise<User | null> {
        try {
            return await SequelizeUser.findByPk(id);
        } catch (err) {
            this.error = err as Error;
            return null;
        }
    }

    async authenticate(): Promise<Sequelize> {
        try {
            await this.sequelize.authenticate();
            return this.sequelize;
        } catch (err) {
            const customError = err as Error;
            customError.message = `Unable to connect to the database: ${customError.message}`;
            throw customError;
        }
    }

    public getError(): Error | null {
        return this.error || null;
    }

    private error?: Error;
}
