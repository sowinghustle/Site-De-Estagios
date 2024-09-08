import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    Default,
    ForeignKey,
    Length,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import { UserToken } from '../../token/model';
import { SequelizeUser } from './user';

type LocalUserToken = Omit<UserToken, 'user'> & {
    userId: number;
    expiredAt?: Date;
};

type SequelizeUserTokenCreation = Omit<
    LocalUserToken,
    'id' | 'expiresAt' | 'expiredAt'
>;

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

    @AllowNull(false)
    @Default(() => {
        const date = new Date();
        date.setDate(date.getDate() + 1); // add a 1
        return date;
    })
    @Column
    public declare expiresAt: Date;

    @Column
    public declare expiredAt?: Date;

    @ForeignKey(() => SequelizeUser)
    @Column
    public declare userId: number;

    @BelongsTo(() => SequelizeUser)
    public declare user: SequelizeUser;
}
