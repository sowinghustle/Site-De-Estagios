import { AccessToken } from '../../models/access-token';
import { Admin } from '../../models/admin';
import { ResetPasswordToken } from '../../models/reset-password-token';
import { Student } from '../../models/student';
import { Supervisor } from '../../models/supervisor';
import { User } from '../../models/user';
import { UserRole } from '../../models/user-role';
import {
    AccessTokenTable,
    AdminTable,
    ResetPasswordTable,
    StudentTable,
    SupervisorTable,
    UserTable,
} from './sequelize-tables';

export function mapSequelizeAdminToModel(entity: AdminTable) {
    return {
        ...entity.toJSON(),
        user: !entity.user ? undefined : mapSequelizeUserToModel(entity.user),
    } as Admin;
}

export function mapSequelizeSupervisorToModel(entity: SupervisorTable) {
    return {
        ...entity.toJSON(),
        user: !entity.user ? undefined : mapSequelizeUserToModel(entity.user),
    } as Supervisor;
}

export function mapSequelizeStudentToModel(entity: StudentTable) {
    return {
        ...entity.toJSON(),
        user: !entity.user ? undefined : mapSequelizeUserToModel(entity.user),
    } as Student;
}

export function mapSequelizeAccessTokenToModel(entity: AccessTokenTable) {
    return {
        ...entity.toJSON(),
        user: !entity.user ? undefined : mapSequelizeUserToModel(entity.user),
    } as AccessToken;
}

export function mapSequelizeResetPasswordTokenToModel(
    entity: ResetPasswordTable
) {
    return entity.toJSON() as ResetPasswordToken;
}

export function mapSequelizeUserToModel(entity: UserTable) {
    const rolesMap: Record<string, UserRole> = {
        admin: UserRole.Adm,
        student: UserRole.Student,
        supervisor: UserRole.Supervisor,
    };

    const role = rolesMap[entity.role];

    return { ...entity.toJSON(), role } as User;
}
