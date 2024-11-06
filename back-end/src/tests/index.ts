import { randomUUID } from 'crypto';
import supertest, { Response } from 'supertest';
import { Admin } from '../models/admin';
import { Student } from '../models/student';
import { Supervisor } from '../models/supervisor';
import { User } from '../models/user';
import { UserRole } from '../models/user-role';
import app from '../modules/app';
import { DeepPartial } from '../modules/config/helpers';
import { deepMerge, toResult } from '../modules/config/utils';
import hashService from '../services/hash';

const accessToken = randomUUID();
const resetPasswordToken = randomUUID();

jest.mock('../services/token', () => {
    return {
        generateAccessToken: () => accessToken,
        generateResetPasswordToken: () => resetPasswordToken,
    };
});

export const requestWithSupertest = supertest(app);

const expectAuthResponseCookies = (res: Response) => {
    const cookies = res.headers['set-cookie'];
    const isArray = Array.isArray(cookies);

    expect(isArray).toBe(true);

    for (let key of ['token=' + accessToken, 'HttpOnly']) {
        expect(cookies[0]).toContain(key);
    }
};

const getUserWithoutPassword = (user: User): Omit<User, 'password'> => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

const expectPromiseNotToReject = async <T>(promise: Promise<T>) => {
    const result = await toResult(promise).resolveAsync();
    expect(result.isSuccess).toBe(true);
    return result.orElseThrow();
};

const expectPromiseNotToBeUndefined = async <T>(promise: Promise<T>) => {
    const result = await toResult(promise).resolveAsync();
    expect(result.isSuccess).toBe(true);
    expect(result.value).not.toBeUndefined();
    return result.orElseThrow() as Exclude<T, undefined>;
};

const requests = {
    async loginAdmin(nameOrEmail: string, password: string) {
        return await requestWithSupertest.post('/api/v1/admin/login').send({
            nameOrEmail,
            password,
        });
    },
};

const models = {
    custom<T>(data: T, replace: DeepPartial<T>): T {
        return deepMerge(data, replace);
    },

    get defaultAdmin(): Admin {
        return {
            name: 'defaultAdminName123',
            user: {
                email: 'admin_email@email.com',
                password: 'adminPassword123*',
                role: UserRole.Adm,
            },
        };
    },

    async getAdminWithEncryptedPasswordAsync(admin: Admin | undefined) {
        expect(admin).not.toBeUndefined();
        return this.custom<Admin>(admin!, {
            user: {
                password: await hashService.encryptPasswordAsync(
                    admin!.user.password
                ),
            },
        });
    },

    getAdminWithoutPassword(admin: Admin | undefined) {
        expect(admin).not.toBeUndefined();
        return {
            ...admin,
            user: getUserWithoutPassword(admin!.user),
        };
    },

    get alternativeAdmin(): Admin {
        return {
            name: 'differentName23',
            user: {
                email: 'differentEmail23@email.com',
                password: 'different_Password 123',
                role: UserRole.Adm,
            },
        };
    },

    get defaultSupervisor(): Supervisor {
        return {
            name: 'Supervisor Name',
            user: {
                email: 'supervisor_name79@email.com',
                password: 'supervisor-123pass__word',
                role: UserRole.Supervisor,
            },
        };
    },

    get alternativeSupervisor(): Supervisor {
        return {
            name: 'Different Supervisor Name',
            user: {
                email: 'anothersupervisor_name123@email.com',
                password: 'anothersupervisor123Password*',
                role: UserRole.Supervisor,
            },
        };
    },

    async getSupervisorWithEncryptedPasswordAsync(
        supervisor: Supervisor | undefined
    ) {
        expect(supervisor).not.toBeUndefined();
        return this.custom<Supervisor>(supervisor!, {
            user: {
                password: await hashService.encryptPasswordAsync(
                    supervisor!.user.password
                ),
            },
        });
    },

    getSupervisorWithoutPassword(supervisor: Supervisor | undefined) {
        expect(supervisor).not.toBeUndefined();
        return {
            ...supervisor,
            user: getUserWithoutPassword(supervisor!.user),
        };
    },

    get defaultStudent(): Student {
        return {
            fullName: 'Student Name',
            user: {
                email: 'student_name79@email.com',
                password: 'student-123pass__word',
                role: UserRole.Student,
            },
        };
    },

    get alternativeStudent(): Student {
        return {
            fullName: 'Different Student Name',
            user: {
                email: 'anotherStudent_name123@email.com',
                password: 'anotherStudent123Password*',
                role: UserRole.Student,
            },
        };
    },

    async getStudentWithEncryptedPasswordAsync(student: Student | undefined) {
        expect(student).not.toBeUndefined();
        return this.custom<Student>(student!, {
            user: {
                password: await hashService.encryptPasswordAsync(
                    student!.user.password
                ),
            },
        });
    },

    getStudentWithoutPassword(student: Student | undefined) {
        expect(student).not.toBeUndefined();
        return {
            ...student,
            user: getUserWithoutPassword(student!.user),
        };
    },
};

export default Object.freeze({
    resetPasswordToken,
    accessToken,
    models,
    requests,
    expectAuthResponseCookies,
    expectPromiseNotToReject,
    expectPromiseNotToBeUndefined,
});
