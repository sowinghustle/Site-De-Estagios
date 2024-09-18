import { randomUUID } from 'crypto';
import supertest from 'supertest';
import config from '.';
import { Admin } from '../admin/model';
import app from '../app';
import { DatabaseConnection } from '../database';
import { Supervisor } from '../supervisor/model';
import { buildToResult, Result } from './utils';

export const requestWithSupertest = supertest(app);
export const token = randomUUID();

jest.mock('../token/service', () => {
    return {
        generateUserToken: () => token,
    };
});

export const expectPromiseNotToReject = async <T>(promise: Promise<T>) => {
    await expect(promise.then(() => true).catch(() => false)).resolves.toBe(
        true
    );
    return await promise;
};

export const testAuthResponseCookies = (res: any) => {
    let cookies = res.headers['set-cookie'];

    expect(Array.isArray(cookies)).toBe(true);

    for (let key of [`token=${token}`, 'HttpOnly'])
        expect(cookies[0]).toContain(key);
};

export const defaultAdmin: Admin = Object.freeze({
    name: config.instituition.adminName,
    user: {
        email: config.instituition.adminEmail,
        password: config.instituition.adminPassword,
    },
});

export const alternativeAdmin: Admin = Object.freeze({
    name: 'differentName23',
    user: {
        email: 'differentEmail23@email.com',
        password: 'different_Password 123',
    },
});

export const defaultSupervisor: Supervisor = Object.freeze({
    name: 'Supervisor Name',
    user: {
        email: 'supervisor_name123@email.com',
        password: 'supervisor_Password 15123*',
    },
});

export const alternativeSupervisor: Supervisor = Object.freeze({
    name: 'Different Supervisor Name',
    user: {
        email: 'anotherSupervisor_name123@email.com',
        password: 'anotherSupervisorPassword32151',
    },
});

export const saveAdmin = async (
    conn: DatabaseConnection,
    data: Admin
): Promise<Result<Admin>> => {
    const toResult = buildToResult<Admin>();

    try {
        const admin = await conn.saveNewAdmin(data);
        const error = conn.getError();

        if (error) {
            return toResult(error);
        }

        return toResult(admin!);
    } catch (err: any) {
        return toResult(err as Error);
    }
};

export const saveAndTestAdmin = async (
    conn: DatabaseConnection,
    data: Admin
) => {
    const expectedAdminValue = data;
    const result = await saveAdmin(conn, data);
    expect(result.isError).toBe(false);
    expect(result.value).toMatchObject(expectedAdminValue);
    return result.value as Admin;
};

export const saveSupervisor = async (
    conn: DatabaseConnection,
    data: Supervisor
): Promise<Result<Admin | undefined>> => {
    const toResult = buildToResult<Supervisor>();

    try {
        const admin = await conn.saveNewSupervisor(data);
        const error = conn.getError();

        if (error) {
            return toResult(error);
        }

        return toResult(admin!);
    } catch (err: any) {
        return toResult(err as Error);
    }
};

export const saveAndTestSupervisor = async (
    conn: DatabaseConnection,
    data: Supervisor
) => {
    const expectedSupervisorValue = data;
    const result = await saveSupervisor(conn, data);
    expect(result.isError).toBe(false);
    expect(result.value).toMatchObject(expectedSupervisorValue);
    return result.value as Supervisor;
};

export const adminAuthenticate = async (
    nameOrEmail: string,
    password: string
) => {
    return await requestWithSupertest.post('/api/v1/admin/login').send({
        nameOrEmail,
        password,
    });
};

export const supervisorAuthenticate = async (
    email: string,
    password: string
) => {
    return await requestWithSupertest.post('/api/v1/supervisor/login').send({
        email,
        password,
    });
};
