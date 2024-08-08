import { Model, Optional } from 'sequelize';
import { Admin } from '../../admin/model';

type AdminWithoutTokens = Omit<Admin, 'tokens'> & {
    tokens: string;
};

export type SequelizeAdminCreation = Optional<AdminWithoutTokens, 'id'>;
export class SequelizeAdmin extends Model<
    AdminWithoutTokens,
    SequelizeAdminCreation
> {
    public declare id: number;
    public declare email: string;
    public declare password: string;
    public declare tokens: string;

    public toJSON() {
        const data = this.get();

        return {
            ...data,
            tokens: data.tokens.split(','),
        };
    }
}
