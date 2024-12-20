import { User } from './user';

export type Student = {
    id?: number;
    fullName: string;
    user: User;
};

export type StudentCollection = Student[];
