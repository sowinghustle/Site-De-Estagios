import { Admin } from '../admin/model';
import { Student } from '../student/model';
import { Supervisor } from '../supervisor/model';
import { AccessToken, ResetPasswordToken } from '../token/model';
import { User, UserRole } from '../user/model';
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
