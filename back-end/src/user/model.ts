export type User = {
    id: number;
    username: string;
    email: string;
    password: string;
    token: string;
};

export type UserCollection = User[];

export type CreateUserDto = {
    username: string;
    email: string;
    password: string;
};

export type UpdateUserDto = {
    username: string;
    email: string;
};
