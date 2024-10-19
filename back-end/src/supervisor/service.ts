import { buildToResult, Result } from '../config/utils';
import { DatabaseResolver } from '../database';
import hashService from '../hash/service';
import userService from '../user/service';
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

        const verifyEmailResult = await userService.ensureEmailIsNotInUse(
            supervisor.user.email
        );

        if (verifyEmailResult.isError) {
            return toResult(verifyEmailResult.value);
        }

        const conn = await DatabaseResolver.getConnection();
        const encryptedPassword = await hashService.encryptPassword(
            supervisor.user.password
        );
        const createdSupervisor = await conn.saveNewSupervisor({
            ...supervisor,
            user: {
                ...supervisor.user,
                password: encryptedPassword,
            },
        });
        const error = conn.getError();

        if (error) {
            return toResult(error);
        }

        return toResult(createdSupervisor!);
    }
}

const supervisorService = new SupervisorService();

export default supervisorService;
