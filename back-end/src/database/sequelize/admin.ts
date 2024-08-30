import { Optional } from 'sequelize';
import { Admin } from '../../admin/model';
import { SequelizeUser } from './user';
import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    ForeignKey,
    Index,
    Model,
    NotEmpty,
    NotNull,
    PrimaryKey,
    Table,
    Unique,
} from 'sequelize-typescript';

type LocalAdmin = Omit<Admin, 'user'> & {
    userId: number;
};

export type SequelizeAdminCreation = Optional<LocalAdmin, 'id'>;

@Table({
    tableName: 'admins',
})
export class SequelizeAdmin extends Model<LocalAdmin, SequelizeAdminCreation> {
    @PrimaryKey
    @AutoIncrement
    @Column
    public declare id: number;

    @Index
    @Unique
    @NotEmpty
    @Column
    public declare name: string;

    @ForeignKey(() => SequelizeUser)
    @Column
    public declare userId: number;

    @BelongsTo(() => SequelizeUser)
    public declare user: SequelizeUser;
}
