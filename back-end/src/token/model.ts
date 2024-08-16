import { User } from '../user/model';

export type UserToken = {
    id?: number;
    token: string;
    user: User;
    expiredAt?: Date;
};

export type UserTokenCollection = UserToken[];
