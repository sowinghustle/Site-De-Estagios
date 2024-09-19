import { User } from '../user/model';

export type Supervisor = {
    id?: number;
    name: string;
    user: User;
};

export type SupervisorCollection = Supervisor[];
