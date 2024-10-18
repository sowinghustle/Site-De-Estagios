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
import { Admin } from '../admin/model';
import config from '../config';
import { Student } from '../student/model';
import { Supervisor } from '../supervisor/model';
import { UserToken } from '../token/model';
import { User } from '../user/model';

type SequelizeUser = User;
type SequelizeAdmin = Omit<Admin, 'user'> & { userId: number };
type SequelizeSupervisor = Omit<Supervisor, 'user'> & { userId: number };
type SequelizeStudent = Omit<Student, 'user'> & { userId: number };
type SequelizeUserToken = Omit<UserToken, 'user'> & {
    userId: number;
    expiredAt?: Date;
};

type UserCreate = Optional<SequelizeUser, 'id'>;
type AdminCreate = Omit<Optional<SequelizeAdmin, 'id'>, 'userId'>;
type SupervisorCreate = Omit<Optional<SequelizeSupervisor, 'id'>, 'userId'>;
type StudentCreate = Omit<Optional<SequelizeStudent, 'id'>, 'userId'>;
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
    public declare supervisor: SupervisorTable;

    @PrimaryKey
    @AutoIncrement
    @Column
    public declare id: number;

    @Index
    @Unique
    @AllowNull(false)
    @Length({
        max: config.validations.maxEmailLength,
        msg: config.messages.invalidEmail,
    })
    @Validate({
        isEmail: {
            msg: config.messages.invalidEmail,
        },
    })
    @Column
    public declare email: string;

    @Index
    @Column(DataTypes.STRING)
    public declare role: string;

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
    @AllowNull(false)
    @NotEmpty
    @Column
    public declare name: string;
}

@Table({ tableName: 'supervisors' })
export class SupervisorTable extends Model<
    SequelizeSupervisor,
    SupervisorCreate
> {
    public declare user: UserTable;

    @PrimaryKey
    @AutoIncrement
    @Column
    public declare id: number;

    @Index
    @NotEmpty
    @AllowNull(false)
    @Column
    public declare name: string;
}

@Table({ tableName: 'students' })
export class StudentTable extends Model<SequelizeStudent, StudentCreate> {
    public declare user: UserTable;

    @PrimaryKey
    @AutoIncrement
    @Column
    public declare id: number;

    @Index
    @NotEmpty
    @AllowNull(false)
    @Column
    public declare fullName: string;
}
