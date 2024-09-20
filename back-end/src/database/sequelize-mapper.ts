import { Admin } from '../admin/model';
import { Student } from '../student/model';
import { Supervisor } from '../supervisor/model';
import { UserToken } from '../token/model';
import { User, UserRole } from '../user/model';
import {
    AdminTable,
    StudentTable,
    SupervisorTable,
    UserTable,
    UserTokenTable,
} from './sequelize-tables';

export function mapSequelizeAdminToModel(entity: AdminTable) {
    return {
        ...entity.toJSON(),
        user: !entity.user
            ? undefined
            : mapSequelizeUserToModel(entity.user, UserRole.Adm),
    } as Admin;
}

export function mapSequelizeSupervisorToModel(entity: SupervisorTable) {
    return {
        ...entity.toJSON(),
        user: !entity.user
            ? undefined
            : mapSequelizeUserToModel(entity.user, UserRole.Supervisor),
    } as Supervisor;
}

export function mapSequelizeStudentToModel(entity: StudentTable) {
    return {
        ...entity.toJSON(),
        user: !entity.user
            ? undefined
            : mapSequelizeUserToModel(entity.user, UserRole.Student),
    } as Student;
}

export function mapSequelizeUserTokenToModel(
    entity: UserTokenTable,
    userRole: UserRole = UserRole.Unknown
) {
    return {
        ...entity.toJSON(),
        user: !entity.user
            ? undefined
            : mapSequelizeUserToModel(entity.user, userRole),
    } as UserToken;
}

export function mapSequelizeUserToModel(
    entity: UserTable,
    role: UserRole = UserRole.Unknown
) {
    return { ...entity.toJSON(), role } as User;
}
