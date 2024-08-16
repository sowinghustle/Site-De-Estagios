import { StudentUser } from '../user/model';

export type Student = {
    id: number;
    fullName: string;
    user: StudentUser;
};

export type StudentCollection = Student[];
