import { Optional } from 'sequelize';
import {
    AutoIncrement,
    BelongsTo,
    Column,
    ForeignKey,
    Index,
    Model,
    NotEmpty,
    PrimaryKey,
    Table,
    Unique,
} from 'sequelize-typescript';
import { Admin } from '../../admin/model';
import { SequelizeUser } from './user';

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
