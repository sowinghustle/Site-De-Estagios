import { User } from '../user/model';

export type Admin = {
    id?: number;
    name: string;
    user: User;
};

export type AdminCollection = Admin[];
