import { User } from '../user/model';

export type AccessToken = {
    id?: number;
    token: string;
    user: User;
    expiresAt: Date;
    expiredAt?: Date;
};

export type ResetPasswordToken = {
    id?: number;
    email: string;
    token: string;
    expiresAt: Date;
    expiredAt?: Date;
};
