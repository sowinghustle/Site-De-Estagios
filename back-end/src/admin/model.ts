import { AdmUser } from '../user/model';

export type Admin = {
    id?: number;
    name: string;
    user: AdmUser;
};

export type AdminCollection = Admin[];
