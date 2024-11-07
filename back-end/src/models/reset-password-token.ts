export type ResetPasswordToken = {
    id?: number;
    email: string;
    token: string;
    expiresAt: Date;
    expiredAt?: Date;
};
