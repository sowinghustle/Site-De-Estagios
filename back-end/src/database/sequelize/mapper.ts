import { Admin } from '../../admin/model';
import { UserToken } from '../../token/model';
import { User } from '../../user/model';
import { AdminTable, UserTable, UserTokenTable } from './tables';

export function mapSequelizeToModel<T>(entity: T): any {
    if (entity instanceof AdminTable) {
        return {
            ...entity.toJSON(),
            user: mapSequelizeUserModel(entity.user),
        } as Admin;
    }

    if (entity instanceof UserTable) {
        return mapSequelizeUserModel(entity)!;
    }

    if (entity instanceof UserTokenTable) {
        return {
            ...entity.toJSON(),
            user: mapSequelizeUserModel(entity.user),
        } as UserToken;
    }

    throw new Error('Esta entidade não pertence aos do banco');
}

function mapSequelizeUserModel(
    entity: UserTable | undefined
): User | undefined {
    if (entity) {
        return entity.toJSON() as User;
    }
}
