export type CreateUserDto = {
    username: string;
    email: string;
    password: string;
};

export type UpdateUserDto = {
    id: number;
    username: string;
    email: string;
};
