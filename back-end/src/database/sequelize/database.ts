import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { DatabaseConnection } from '..';
import { Admin, AdminCollection } from '../../admin/model';
import project from '../../config/project';
import respMessages from '../../config/responseMessages';
import { UserToken } from '../../token/model';
import { User, UserRole } from '../../user/model';
import { SequelizeAdmin } from './admin';
import { mapSequelizeToModel } from './mapper';
import { SequelizeUserToken } from './tokens';
import { SequelizeUser } from './user';

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
                project.environment !== 'test'
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
            const model = await SequelizeAdmin.findOne({
                where: {
                    [Op.or]: [
                        { name: nameOrEmail },
                        { '$user.email$': nameOrEmail },
                    ],
                },
                include: [
                    {
                        model: SequelizeUser,
                        as: 'user',
                    },
                ],
            });

            if (!model) {
                throw new Error(respMessages.adminNotFoundWithNameOrEmail);
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
            const model = await SequelizeUserToken.create({
                token,
                userId: userId,
            });

            return mapSequelizeToModel(model);
        } catch (err) {
            this.error = err as Error;
        }
    }
    async invalidateUserToken(token: string): Promise<UserToken | undefined> {
        try {
            const model = await SequelizeUserToken.findOne({
                where: { token },
                include: [SequelizeUser],
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
            const user = await SequelizeUser.create(
                {
                    ...admin.user,
                    role: UserRole.Adm,
                },
                { transaction }
            );

            const model = await SequelizeAdmin.create(
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
            const admins = await SequelizeAdmin.findAll({
                include: [SequelizeUser],
            });

            return admins.map(mapSequelizeToModel);
        } catch (err) {
            this.error = err as Error;
            return [];
        }
    }
    async findUserByToken(token: string): Promise<User | undefined> {
        try {
            const model = await SequelizeUserToken.findOne({
                where: { token },
                attributes: [],
                include: [SequelizeUser],
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
            if (!this.sequelize) {
                throw new Error(respMessages.databaseImplNotDefined);
            }

            this.sequelize.addModels([
                SequelizeUser,
                SequelizeUserToken,
                SequelizeAdmin,
            ]);

            if (project.environment !== 'production') {
                await this.sequelize.sync({ force: true });
            }

            await this.sequelize.authenticate({});
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
