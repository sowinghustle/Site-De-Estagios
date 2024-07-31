import { Model, Optional } from 'sequelize';
import { User } from '../../user/model';

export type SequelizeUserCreation = Optional<User, 'id'>;

export class SequelizeUser extends Model<User, SequelizeUserCreation> {
    public declare id: number;
    public declare username: string;
    public declare email: string;
    public declare password: string;
    public declare token: string;
}
