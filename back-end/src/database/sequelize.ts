import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { DatabaseConnection } from '.';
import { Admin, AdminCollection } from '../admin/model';
import config from '../config';
import { Student } from '../student/model';
import { Supervisor } from '../supervisor/model';
import { UserToken } from '../token/model';
import { User, UserRole } from '../user/model';
import {
    mapSequelizeAdminToModel,
    mapSequelizeStudentToModel,
    mapSequelizeSupervisorToModel,
    mapSequelizeUserTokenToModel,
    mapSequelizeUserToModel,
} from './sequelize-mapper';
import {
    AdminTable,
    StudentTable,
    SupervisorTable,
    UserTable,
    UserTokenTable,
} from './sequelize-tables';

export class SequelizeDatabaseConnection implements DatabaseConnection {
    private static models = [
        UserTable,
        UserTokenTable,
        AdminTable,
        SupervisorTable,
        StudentTable,
    ];
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
    async saveNewUserToken(
        token: string,
        userId: number
    ): Promise<UserToken | undefined> {
        try {
            const model = await UserTokenTable.create({
                token,
                userId,
            });

            return mapSequelizeUserTokenToModel(model);
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

            if (!model) return;

            await model.update({ expiredAt: new Date() });

            return mapSequelizeUserTokenToModel(model);
        } catch (err) {
            this.error = err as Error;
        }
    }
    async findUserByValidUserToken(token: string): Promise<User | undefined> {
        try {
            const model = await UserTokenTable.findOne({
                where: { token },
                attributes: [],
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
            if (now > model.expiresAt) return;
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

    async init(): Promise<void> {
        try {
            if (!this.sequelize)
                throw new Error(config.messages.databaseImplNotDefined);

            this.sequelize.addModels(SequelizeDatabaseConnection.models);

            // user and user-tokens association
            UserTable.hasMany(UserTokenTable, { as: 'tokens' });
            UserTokenTable.belongsTo(UserTable, { as: 'user' });

            // user and admin association
            UserTable.hasOne(AdminTable, { as: 'admin' });
            AdminTable.belongsTo(UserTable, { as: 'user' });

            // user and supervisor association
            UserTable.hasOne(SupervisorTable, { as: 'supervisor' });
            SupervisorTable.belongsTo(UserTable, { as: 'user' });

            // user and student association
            UserTable.hasOne(SupervisorTable, { as: 'student' });
            StudentTable.belongsTo(UserTable, { as: 'user' });

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
