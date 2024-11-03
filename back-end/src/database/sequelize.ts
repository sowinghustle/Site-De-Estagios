import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { DatabaseConnection } from '.';
import { Admin, AdminCollection } from '../admin/model';
import config from '../config';
import { UnhandledError } from '../config/errors';
import { Student } from '../student/model';
import { Supervisor } from '../supervisor/model';
import { AccessToken, ResetPasswordToken } from '../token/model';
import { User, UserRole } from '../user/model';
import {
    mapSequelizeAccessTokenToModel,
    mapSequelizeAdminToModel,
    mapSequelizeResetPasswordTokenToModel,
    mapSequelizeStudentToModel,
    mapSequelizeSupervisorToModel,
    mapSequelizeUserToModel,
} from './sequelize-mapper';
import {
    AccessTokenTable,
    AdminTable,
    ResetPasswordTable,
    StudentTable,
    SupervisorTable,
    UserTable,
} from './sequelize-tables';

export class SequelizeDatabaseConnection implements DatabaseConnection {
    private static models = [
        UserTable,
        AccessTokenTable,
        AdminTable,
        SupervisorTable,
        StudentTable,
        ResetPasswordTable,
    ];
    private static sequelize: Sequelize;
    private _error?: Error;

    private get error(): Error | undefined {
        return this._error;
    }

    private set error(err: Error) {
        config.external.logger(err.message);
        this._error = err;
    }

    constructor() {
        if (config.project.environment === 'production') {
            this.sequelize = new Sequelize(config.project.databaseUrl);
            return;
        }

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

    async saveNewResetPasswordToken(
        email: string,
        token: string
    ): Promise<ResetPasswordToken | undefined> {
        try {
            const model = await ResetPasswordTable.create({
                email,
                token,
            });

            const entity = mapSequelizeResetPasswordTokenToModel(model);

            return entity;
        } catch (err) {
            this.error = err as Error;
        }
    }

    async findValidResetPasswordToken(
        email: string,
        token: string
    ): Promise<ResetPasswordToken | undefined> {
        try {
            const model = await ResetPasswordTable.findOne({
                where: {
                    email,
                    token,
                },
            });

            // token não encontrado
            if (!model) return;
            const now = new Date();

            // token expirado
            if (model.expiredAt) return;
            if (now > model.expiresAt) return;

            return mapSequelizeResetPasswordTokenToModel(model);
        } catch (err) {
            this.error = err as Error;
        }
    }

    async invalidateResetPasswordToken(
        token: string
    ): Promise<ResetPasswordToken | undefined> {
        try {
            const model = await ResetPasswordTable.findOne({
                where: { token },
            });

            if (!model) return;

            await model.update({ expiredAt: new Date() });

            return mapSequelizeResetPasswordTokenToModel(model);
        } catch (err) {
            this.error = err as Error;
        }
    }

    async updateUserPasswordByEmail(
        email: string,
        newPassword: string
    ): Promise<User | undefined> {
        try {
            const model = await UserTable.findOne({
                where: { email },
            });

            if (!model) return;

            await model.update({ password: newPassword });

            return mapSequelizeUserToModel(model);
        } catch (err) {
            this.error = err as Error;
        }
    }

    async saveNewAdmin(admin: Admin): Promise<Admin | undefined> {
        try {
            admin.user.role = UserRole.Adm;

            const model = await AdminTable.create(admin, {
                include: [
                    {
                        model: UserTable,
                        as: 'user',
                    },
                ],
            });

            const entity = mapSequelizeAdminToModel(model);

            return entity;
        } catch (err) {
            this.error = err as Error;
        }
    }
    async getAdmins(): Promise<AdminCollection> {
        try {
            const admins = await AdminTable.findAll({
                include: [
                    {
                        model: UserTable,
                        as: 'user',
                    },
                ],
            });

            return admins.map(mapSequelizeAdminToModel);
        } catch (err) {
            this.error = err as Error;
            return [];
        }
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

            if (!model) return;

            return mapSequelizeAdminToModel(model);
        } catch (err) {
            this.error = err as Error;
        }
    }
    async saveNewSupervisor(
        supervisor: Supervisor
    ): Promise<Supervisor | undefined> {
        try {
            supervisor.user.role = UserRole.Supervisor;

            const model = await SupervisorTable.create(supervisor, {
                include: [
                    {
                        model: UserTable,
                        as: 'user',
                    },
                ],
            });

            const entity = mapSequelizeSupervisorToModel(model);

            return entity;
        } catch (err) {
            this.error = err as Error;
        }
    }
    async findSupervisorByEmail(
        email: string
    ): Promise<Supervisor | undefined> {
        try {
            const model = await SupervisorTable.findOne({
                where: {
                    [Op.or]: [{ '$user.email$': email }],
                },
                include: [
                    {
                        model: UserTable,
                        as: 'user',
                    },
                ],
            });

            if (!model) return;

            return mapSequelizeSupervisorToModel(model);
        } catch (err) {
            this.error = err as Error;
        }
    }
    async saveNewStudent(student: Student): Promise<Student | undefined> {
        try {
            student.user.role = UserRole.Student;

            const model = await StudentTable.create(student, {
                include: [
                    {
                        model: UserTable,
                        as: 'user',
                    },
                ],
            });

            const entity = mapSequelizeStudentToModel(model);

            return entity;
        } catch (err) {
            this.error = err as Error;
        }
    }
    async findStudentByEmail(email: string): Promise<Student | undefined> {
        try {
            const model = await StudentTable.findOne({
                where: {
                    [Op.or]: [{ '$user.email$': email }],
                },
                include: [
                    {
                        model: UserTable,
                        as: 'user',
                    },
                ],
            });

            if (!model) return;

            return mapSequelizeStudentToModel(model);
        } catch (err) {
            this.error = err as Error;
        }
    }
    async saveNewAccessToken(
        token: string,
        userId: number
    ): Promise<AccessToken | undefined> {
        try {
            const model = await AccessTokenTable.create({
                token,
                userId,
            });

            return mapSequelizeAccessTokenToModel(model);
        } catch (err) {
            this.error = err as Error;
        }
    }
    async invalidateAccessToken(
        token: string
    ): Promise<AccessToken | undefined> {
        try {
            const model = await AccessTokenTable.findOne({
                where: { token },
                include: [
                    {
                        model: UserTable,
                        as: 'user',
                    },
                ],
            });

            if (!model) return;

            await model.update({ expiredAt: new Date() });

            return mapSequelizeAccessTokenToModel(model);
        } catch (err) {
            this.error = err as Error;
        }
    }
    async findUserByValidAccessToken(token: string): Promise<User | undefined> {
        try {
            const model = await AccessTokenTable.findOne({
                where: { token },
                include: [
                    {
                        model: UserTable,
                        as: 'user',
                    },
                ],
            });

            // token não encontrado
            if (!model) return;
            const now = new Date();

            // token expirado
            if (model.expiredAt) return;
            if (now > model.expiresAt) {
                await model.update({ expiredAt: now });
                return;
            }

            return mapSequelizeUserToModel(model.user);
        } catch (err) {
            this.error = err as Error;
        }
    }
    async findUserById(id: number): Promise<User | undefined> {
        try {
            const model = await UserTable.findByPk(id);
            if (!model) return;
            return mapSequelizeUserToModel(model);
        } catch (err) {
            this.error = err as Error;
        }
    }
    async findUserByEmail(email: string): Promise<User | undefined> {
        try {
            const model = await UserTable.findOne({ where: { email } });
            if (!model) return;
            return mapSequelizeUserToModel(model);
        } catch (err) {
            this.error = err as Error;
        }
    }
    async verifyIfEmailIsInUse(email: string): Promise<boolean | undefined> {
        try {
            const result = await UserTable.findAndCountAll({
                where: { email },
            });
            return result.count > 0;
        } catch (err) {
            this.error = err as Error;
        }
    }

    async init(): Promise<void> {
        try {
            if (!this.sequelize)
                throw new Error(config.messages.databaseImplNotDefined);

            this.sequelize.addModels(SequelizeDatabaseConnection.models);

            // user and user-tokens association
            UserTable.hasMany(AccessTokenTable, {
                as: 'access_token',
                foreignKey: 'id',
            });
            AccessTokenTable.belongsTo(UserTable, { as: 'user' });

            // user and admin association
            UserTable.hasOne(AdminTable, { as: 'admin', foreignKey: 'id' });
            AdminTable.belongsTo(UserTable, { as: 'user' });

            // user and supervisor association
            UserTable.hasOne(SupervisorTable, {
                as: 'supervisor',
                foreignKey: 'id',
            });
            SupervisorTable.belongsTo(UserTable, { as: 'user' });

            // user and student association
            UserTable.hasOne(StudentTable, { as: 'student', foreignKey: 'id' });
            StudentTable.belongsTo(UserTable, { as: 'user' });

            // sync
            if (config.project.environment !== 'production')
                await this.sequelize.sync();
            await this.sequelize.authenticate();
        } catch (err) {
            const customError = err as Error;
            customError.message = `Unable to connect to the database: ${customError.message}`;
            throw customError;
        }
    }

    getError(): UnhandledError | undefined {
        if (!this.error) return;
        const error = new UnhandledError(this.error.message);
        error.stack = this.error.stack;
        return error;
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
