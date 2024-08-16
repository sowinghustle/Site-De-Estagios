import { Optional } from 'sequelize';
import { Admin } from '../../admin/model';
import { SequelizeUser } from './user';
import {
    AutoIncrement,
    BelongsTo,
    Column,
    ForeignKey,
    HasOne,
    Index,
    Model,
    PrimaryKey,
    Table,
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
    @Column
    public declare name: string;

    @ForeignKey(() => SequelizeUser)
    @Column
    public declare userId: number;

    @BelongsTo(() => SequelizeUser)
    public declare user: SequelizeUser;
}
