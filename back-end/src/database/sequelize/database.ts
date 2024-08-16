import { Database } from '..';
import { Admin, AdminCollection } from '../../admin/model';
import { Sequelize } from 'sequelize-typescript';
import { SequelizeUser } from './user';
import { SequelizeAdmin } from './admin';
import { User, UserRole } from '../../user/model';
import { SequelizeUserToken } from './tokens';
import { UserToken } from '../../token/model';
import { mapSequelizeToModel } from './mapper';
import { Op } from 'sequelize';

export class SequelizeDatabase implements Database {
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
                throw new Error(
                    'Administrador não encontrado com este nome ou email'
                );
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
                userId,
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

            return mapSequelizeToModel(model);
        } catch (err) {
            this.error = err as Error;
        }
    }
    async saveNewAdmin(admin: Admin): Promise<Admin | undefined> {
        const transaction = await this.sequelize.transaction();
        const params = { transaction };

        try {
            const adminUser = {
                ...admin.user,
                role: UserRole.Adm,
            };

            const user = await SequelizeUser.create(adminUser, params);

            const createAdminData = {
                ...admin,
                userId: user.id,
            };

            const model = await SequelizeAdmin.create(createAdminData, params);

            return mapSequelizeToModel(model);
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

    getError(): Error | undefined {
        return this.error;
    }

    async authenticate(): Promise<void> {
        try {
            await this.sequelize.authenticate();
        } catch (err) {
            const customError = err as Error;
            customError.message = `Unable to connect to the database: ${customError.message}`;
            throw customError;
        }
    }

    private static sequelize: Sequelize;
    private error?: Error;

    private get sequelize(): Sequelize {
        return SequelizeDatabase.sequelize;
    }

    static init() {
        const sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            repositoryMode: false,
        });

        sequelize.addModels([
            SequelizeAdmin,
            SequelizeUser,
            SequelizeUserToken,
        ]);

        this.sequelize = sequelize;
    }

    static async sync() {
        await this.sequelize.sync();
    }
}
