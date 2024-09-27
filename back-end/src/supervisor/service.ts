import { buildToResult, Result } from '../config/utils';
import { DatabaseResolver } from '../database';
import { Supervisor } from './model';

export class SupervisorService {
    async findSupervisorByEmail(
        email: string
    ): Promise<Result<Supervisor | undefined>> {
        const toResult = buildToResult<Supervisor | undefined>();
        const conn = await DatabaseResolver.getConnection();
        const supervisor = await conn.findSupervisorByEmail(email);
        const error = conn.getError();

        if (error) {
            return toResult(error);
        }

        return toResult(supervisor);
    }
    async saveNewSupervisor(
        supervisor: Supervisor
    ): Promise<Result<Supervisor>> {
        const toResult = buildToResult<Supervisor>();
        const conn = await DatabaseResolver.getConnection();
        const createdSupervisor = await conn.saveNewSupervisor(supervisor);
        const error = conn.getError();

        if (error) {
            return toResult(error);
        }

        return toResult(createdSupervisor!);
    }
}

const supervisorService = new SupervisorService();

export default supervisorService;
