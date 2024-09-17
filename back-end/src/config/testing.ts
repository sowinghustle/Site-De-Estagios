import { randomUUID } from 'crypto';
import supertest from 'supertest';
import config from '.';
import { Admin } from '../admin/model';
import app from '../app';
import { DatabaseConnection } from '../database';
import { Supervisor } from '../supervisor/model';
import { ResultOrError } from './utils';

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
        password: 'supervisorPassword15123',
    },
});

export const saveAdmin = async (
    conn: DatabaseConnection,
    admin: Admin
): Promise<ResultOrError<Admin | undefined>> => {
    return await conn
        .saveNewAdmin(admin)
        .then((value) => {
            if (conn.getError()) {
                return { error: conn.getError() };
            }
            return { value };
        })
        .catch((error: Error) => ({ error }));
};

export const saveAndTestAdmin = async (
    conn: DatabaseConnection,
    admin: Admin
) => {
    const expectedAdminValue = admin;
    const { error, value } = await saveAdmin(conn, admin);
    expect(value).toMatchObject(expectedAdminValue);
    expect(error).toBeUndefined();
    return value!;
};

export const saveSupervisor = async (
    conn: DatabaseConnection,
    supervisor: Supervisor
): Promise<ResultOrError<Admin | undefined>> => {
    return await conn
        .saveNewSupervisor(supervisor)
        .then((value) => {
            if (conn.getError()) {
                return { error: conn.getError() };
            }
            return { value };
        })
        .catch((error: Error) => ({ error }));
};

export const saveAndTestSupervisor = async (
    conn: DatabaseConnection,
    supervisor: Supervisor
) => {
    const expectedSupervisorValue = supervisor;
    const { error, value } = await saveSupervisor(conn, supervisor);
    expect(value).toMatchObject(expectedSupervisorValue);
    expect(error).toBeUndefined();
    return value!;
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
