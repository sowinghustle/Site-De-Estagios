import { User } from '../user/model';

export type UserToken = {
    id?: number;
    token: string;
    user: User;
    expiresAt: Date;
};

export type UserTokenCollection = UserToken[];
