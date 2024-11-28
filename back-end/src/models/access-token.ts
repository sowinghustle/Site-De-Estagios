import { User } from './user';

export type AccessToken = {
    id?: number;
    token: string;
    user: User;
    expiresAt: Date;
    expiredAt?: Date;
};
