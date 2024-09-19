import { randomUUID } from 'crypto';
import supertest from 'supertest';
import config from '.';
import { Admin } from '../admin/model';
import app from '../app';
import { DatabaseConnection } from '../database';
import hashService from '../hash/service';
import { Student } from '../student/model';
import { Supervisor } from '../supervisor/model';
import { User } from '../user/model';
import { buildToResult, Result } from './utils';

export const requestWithSupertest = supertest(app);
export const token = randomUUID();

jest.mock('../token/service', () => {
    return {
        generateUserToken: () => token,
    };
});

export const getUserWithEncryptedPassword = async (
    user: User
): Promise<User> => {
    return {
        ...user,
        password: await hashService.encryptPassword(user.password),
    };
};

export const getUserWithoutPassword = async (
    user: User
): Promise<Omit<User, 'password'>> => {
    const newUser = { ...user } as any;
    delete newUser.password;
    return newUser;
};

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

export const defaultStudent: Student = Object.freeze({
    fullName: 'Student Name',
    user: {
        email: 'student_name79@email.com',
        password: 'student-123pass__word',
    },
});

export const alternativeStudent: Student = Object.freeze({
    fullName: 'Different Student Name',
    user: {
        email: 'anotherStudent_name123@email.com',
        password: 'anotherStudent123Password*',
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
        const supervisor = await conn.saveNewSupervisor(data);
        const error = conn.getError();

        if (error) {
            return toResult(error);
        }

        return toResult(supervisor!);
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

export const saveStudent = async (
    conn: DatabaseConnection,
    data: Student
): Promise<Result<Student | undefined>> => {
    const toResult = buildToResult<Student>();

    try {
        const student = await conn.saveNewStudent({
            ...data,
            user: await getUserWithEncryptedPassword(data.user),
        });
        const error = conn.getError();

        if (error) {
            return toResult(error);
        }

        return toResult(student!);
    } catch (err: any) {
        return toResult(err as Error);
    }
};

export const saveAndTestStudent = async (
    conn: DatabaseConnection,
    data: Student
) => {
    const expectedStudentValue = {
        ...data,
        user: await getUserWithoutPassword(data.user),
    };
    const result = await saveStudent(conn, data);
    expect(result.isError).toBe(false);
    expect(result.value).toMatchObject(expectedStudentValue);
    return result.value as Student;
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
