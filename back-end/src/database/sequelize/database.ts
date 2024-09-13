import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { DatabaseConnection } from '..';
import { Admin, AdminCollection } from '../../admin/model';
import config from '../../config';
import { UserToken } from '../../token/model';
import { User, UserRole } from '../../user/model';
import { mapSequelizeToModel } from './mapper';
import { AdminTable, UserTable, UserTokenTable } from './tables';

export class SequelizeDatabaseConnection implements DatabaseConnection {
    private static sequelize: Sequelize;
    private error?: Error;

    constructor() {
        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            repositoryMode: false,
            pool:
                config.project.environment !== 'test'
                    ? {
                          max: 5,
                          min: 0,
                          acquire: 3000,
                          idle: 1000,
                      }
                    : undefined,
        });
    }

    async findAdminByNameOrEmail(
        nameOrEmail: string
    ): Promise<Admin | undefined> {
        try {
            const model = await AdminTable.findOne({
                where: {
                    [Op.or]: [
                        { name: nameOrEmail },
                        { '$user.email$': nameOrEmail },
                    ],
                },
                include: [
                    {
                        model: UserTable,
                        as: 'user',
                    },
                ],
            });

            if (!model) {
                throw new Error(config.messages.adminNotFoundWithNameOrEmail);
            }

            return mapSequelizeToModel(model);
        } catch (err) {
            this.error = err as Error;
        }
    }
    async saveNewUserToken(
        token: string,
        userId: number
    ): Promise<UserToken | undefined> {
        try {
            const model = await UserTokenTable.create({
                token,
                userId,
            });

            return mapSequelizeToModel(model);
        } catch (err) {
            this.error = err as Error;
        }
    }
    async invalidateUserToken(token: string): Promise<UserToken | undefined> {
        try {
            const model = await UserTokenTable.findOne({
                where: { token },
                include: [
                    {
                        model: UserTable,
                        as: 'user',
                    },
                ],
            });

            if (!model) {
                throw new Error('Este token não foi encontrado!');
            }

            await model.update({ expiredAt: new Date() });

            return mapSequelizeToModel(model);
        } catch (err) {
            this.error = err as Error;
        }
    }
    async saveNewAdmin(admin: Admin): Promise<Admin | undefined> {
        const transaction = await this.sequelize.transaction();

        try {
            const user = await UserTable.create(
                {
                    ...admin.user,
                    role: UserRole.Adm,
                },
                { transaction }
            );

            const model = await AdminTable.create(
                {
                    ...admin,
                    userId: user.id,
                },
                { transaction }
            );

            model.user = user;
            const entity = mapSequelizeToModel(model);

            await transaction.commit();

            return entity;
        } catch (err) {
            await transaction.rollback();
            this.error = err as Error;
        }
    }
    async getAdmins(): Promise<AdminCollection> {
        try {
            const admins = await AdminTable.findAll({
                include: [UserTable],
            });

            return admins.map(mapSequelizeToModel);
        } catch (err) {
            this.error = err as Error;
            return [];
        }
    }
    async findUserByToken(token: string): Promise<User | undefined> {
        try {
            const model = await UserTokenTable.findOne({
                where: { token },
                attributes: [],
                include: [UserTable],
            });

            if (!model) {
                throw new Error('Token não encontrado.');
            }

            const now = new Date();

            if (now > model.expiresAt) {
                throw new Error('Este token expirou!');
            }

            return mapSequelizeToModel(model);
        } catch (err) {
            this.error = err as Error;
        }
    }

    async init(): Promise<void> {
        try {
            if (!this.sequelize)
                throw new Error(config.messages.databaseImplNotDefined);

            this.sequelize.addModels([UserTable, UserTokenTable, AdminTable]);

            // user and user-tokens association
            UserTable.hasMany(UserTokenTable, { as: 'tokens' });
            UserTokenTable.belongsTo(UserTable, { as: 'user' });

            // user and admin association
            UserTable.hasOne(AdminTable, { as: 'admin' });
            AdminTable.belongsTo(UserTable, { as: 'user' });

            // sync
            await this.sequelize.sync({
                force: config.project.environment !== 'production',
            });
            await this.sequelize.authenticate();
        } catch (err) {
            const customError = err as Error;
            customError.message = `Unable to connect to the database: ${customError.message}`;
            throw customError;
        }
    }

    getError(): Error | undefined {
        return this.error;
    }

    getConnection() {
        return this.sequelize;
    }

    private get sequelize() {
        return SequelizeDatabaseConnection.sequelize;
    }

    private set sequelize(seq: Sequelize) {
        SequelizeDatabaseConnection.sequelize = seq;
    }
}
