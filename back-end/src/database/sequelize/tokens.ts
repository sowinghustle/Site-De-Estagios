import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    ForeignKey,
    HasOne,
    Length,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import { SequelizeUser } from './user';
import { UserToken } from '../../token/model';

type LocalUserToken = Omit<UserToken, 'user'> & {
    userId: number;
};

type SequelizeUserTokenCreation = Omit<LocalUserToken, 'id' | 'expiredAt'>;

@Table({
    tableName: 'tokens',
})
export class SequelizeUserToken extends Model<
    LocalUserToken,
    SequelizeUserTokenCreation
> {
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

    @AllowNull
    @Column
    public declare expiredAt?: Date;

    @ForeignKey(() => SequelizeUser)
    @AllowNull(false)
    @Column
    public userId: number = 0;

    @BelongsTo(() => SequelizeUser)
    public declare user: SequelizeUser;
}
