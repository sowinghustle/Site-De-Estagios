import { DataTypes, Optional } from 'sequelize';
import {
    AllowNull,
    AutoIncrement,
    Column,
    Default,
    Index,
    Length,
    Model,
    NotEmpty,
    PrimaryKey,
    Table,
    Unique,
    Validate,
} from 'sequelize-typescript';
import { Admin } from '../../admin/model';
import config from '../../config';
import { UserToken } from '../../token/model';
import { User, UserRole, UserRoleValues } from '../../user/model';

type SequelizeUser = User;
type SequelizeAdmin = Omit<Admin, 'user'> & { userId: number };
type SequelizeUserToken = Omit<UserToken, 'user'> & {
    userId: number;
    expiredAt?: Date;
};

type AdminCreate = Optional<SequelizeAdmin, 'id'>;
type UserCreate = Optional<SequelizeUser, 'id'>;
type UserTokenCreate = Omit<
    SequelizeUserToken,
    'id' | 'expiresAt' | 'expiredAt'
>;

@Table({
    tableName: 'tokens',
})
export class UserTokenTable extends Model<SequelizeUserToken, UserTokenCreate> {
    public declare user: UserTable;

    @PrimaryKey
    @AutoIncrement
    @Column
    public declare id?: number;

    @AllowNull(false)
    @Length({
        min: 1,
        msg: 'Este não é um token válido',
    })
    @Column
    public declare token: string;

    @Column
    public declare expiredAt?: Date;

    @AllowNull(false)
    @Default(() => {
        const date = new Date();
        date.setDate(date.getDate() + 1); // +1 day
        return date;
    })
    @Column
    public declare expiresAt: Date;
}

@Table({
    tableName: 'users',
})
export class UserTable extends Model<SequelizeUser, UserCreate> {
    public declare tokens: UserTokenTable[];
    public declare admin: AdminTable;

    @PrimaryKey
    @AutoIncrement
    @Column
    public declare id: number;

    @Index
    @Unique
    @AllowNull(false)
    @Validate({
        isEmail: {
            msg: config.messages.invalidEmail,
        },
    })
    @Column
    public declare email: string;

    @Column(DataTypes.ENUM(...UserRoleValues))
    public declare role: UserRole;

    @Length({
        min: config.validations.minPasswordLength,
        msg: config.messages.insuficientPasswordCharacters,
    })
    @Column
    public declare password: string;
}

@Table({
    tableName: 'admins',
})
export class AdminTable extends Model<SequelizeAdmin, AdminCreate> {
    public declare user: UserTable;

    @PrimaryKey
    @AutoIncrement
    @Column
    public declare id: number;

    @Index
    @Unique
    @NotEmpty
    @Column
    public declare name: string;
}
