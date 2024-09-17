import config from '../config';
import { ResultOrErrorObject } from '../config/utils';
import { DatabaseResolver } from '../database';
import { Supervisor } from './model';

export class SupervisorService {
    async findSupervisorEmailAndPassword(data: {
        email: string;
        password: string;
    }): Promise<ResultOrErrorObject<{ supervisor: Supervisor }>> {
        const conn = await DatabaseResolver.getConnection();
        const supervisor = await conn.findSupervisorByEmail(data.email);

        if (!supervisor) {
            return {
                error: conn.getError()!,
            };
        }

        if (supervisor.user.password !== data.password) {
            return {
                error: new Error(config.messages.wrongPassword),
            };
        }

        return { supervisor };
    }
    async saveNewSupervisor(
        supervisor: Supervisor
    ): Promise<ResultOrErrorObject<{ supervisor: Supervisor }>> {
        const conn = await DatabaseResolver.getConnection();
        const createdSupervisor = await conn.saveNewSupervisor(supervisor);

        if (!createdSupervisor) {
            return {
                error: conn.getError()!,
            };
        }

        return { supervisor: createdSupervisor };
    }
}

const supervisorService = new SupervisorService();

export default supervisorService;
