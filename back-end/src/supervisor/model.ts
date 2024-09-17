import { SupervisorUser } from '../user/model';

export type Supervisor = {
    id?: number;
    name: string;
    user: SupervisorUser;
};
