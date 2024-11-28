import { User } from './user';

export type Admin = {
    id?: number;
    name: string;
    user: User;
};

export type AdminCollection = Admin[];
