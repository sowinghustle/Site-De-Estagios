import { User } from '../user/model';

export type Student = {
    id?: number;
    fullName: string;
    user: User;
};

export type StudentCollection = Student[];
