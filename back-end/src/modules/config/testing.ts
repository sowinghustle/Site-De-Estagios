import { randomUUID } from 'crypto';
import supertest from 'supertest';
import { Admin } from '../../models/admin';
import { Student } from '../../models/student';
import { Supervisor } from '../../models/supervisor';
import { User } from '../../models/user';
import { UserRole } from '../../models/user-role';
import app from '../../modules/app';
import config from '../../modules/config';
import { toResult } from '../../modules/config/utils';
import adminService from '../../services/admin';
import hashService from '../../services/hash';
import studentService from '../../services/student';
import supervisorService from '../../services/supervisor';

export const requestWithSupertest = supertest(app);

jest.mock('../../services/token', () => {
    return {
        generateAccessToken: () => testingUtils.token,
        generateResetPasswordToken: () => testingUtils.token,
    };
});

const testingUtils = Object.freeze({
    token: randomUUID(),
    getUserWithoutPassword(user: User): Omit<User, 'password'> {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    },
    async getUserWithEncryptedPassword(user: User): Promise<User> {
        return {
            ...user,
            password: await hashService.encryptPasswordAsync(user.password),
        };
    },
    async saveAdmin(data: Admin) {
        return await toResult(adminService.saveNewAdmin(data)).resolveAsync();
    },
    async saveAndTestAdmin(data: Admin) {
        const expectedAdminValue = DEFAULT_ADMIN_WITHOUT_PASSWORD;
        const result = await this.saveAdmin(data);
        expect(result.isError).toBe(false);
        expect(result.value).toMatchObject(expectedAdminValue);
        return result.value as Admin;
    },
    async authenticateAdmin(nameOrEmail: string, password: string) {
        return await requestWithSupertest.post('/api/v1/admin/login').send({
            nameOrEmail,
            password,
        });
    },
    async authenticateSupervisor(email: string, password: string) {
        return await requestWithSupertest
            .post('/api/v1/supervisor/login')
            .send({
                email,
                password,
            });
    },
    async authenticateStudent(email: string, password: string) {
        return await requestWithSupertest.post('/api/v1/student/login').send({
            email,
            password,
        });
    },
    async saveSupervisor(data: Supervisor) {
        return await toResult(
            supervisorService.saveNewSupervisor(data)
        ).resolveAsync();
    },
    async saveAndTestSupervisor(data: Supervisor) {
        const expectedSupervisorValue = DEFAULT_SUPERVISOR_WITHOUT_PASSWORD;
        const result = await this.saveSupervisor(data);
        expect(result.isError).toBe(false);
        expect(result.value).toMatchObject(expectedSupervisorValue);
        return result.value as Supervisor;
    },
    async saveStudent(data: Student) {
        return await toResult(
            studentService.saveNewStudent(data)
        ).resolveAsync();
    },
    async saveAndTestStudent(data: Student) {
        const expectedStudentValue = DEFAULT_STUDENT_WITHOUT_PASSWORD;
        const result = await this.saveStudent(data);
        expect(result.isError).toBe(false);
        expect(result.value).toMatchObject(expectedStudentValue);
        return result.value as Student;
    },
    async expectPromiseNotToReject<T>(promise: Promise<T>) {
        const result = await toResult(promise).resolveAsync();
        expect(result.isSuccess).toBe(true);
        return result.orElseThrow();
    },
    testAuthResponseCookies(res: any) {
        const cookies = res.headers['set-cookie'];

        expect(Array.isArray(cookies)).toBe(true);

        for (let key of [`token=${testingUtils.token}`, 'HttpOnly']) {
            expect(cookies[0]).toContain(key);
        }
    },
});

export const DEFAULT_ADMIN = {
    name: config.instituition.adminName + '123',
    user: {
        email: config.instituition.adminEmail,
        password: config.instituition.adminPassword,
        role: UserRole.Adm,
    },
} as Admin;

export const ALTERNATIVE_ADMIN = {
    name: 'differentName23',
    user: {
        email: 'differentEmail23@email.com',
        password: 'different_Password 123',
        role: UserRole.Adm,
    },
} as Admin;

export const DEFAULT_ADMIN_WITHOUT_PASSWORD = {
    ...DEFAULT_ADMIN,
    user: testingUtils.getUserWithoutPassword(DEFAULT_ADMIN.user),
};

export const DEFAULT_SUPERVISOR = {
    name: 'Supervisor Name',
    user: {
        email: 'supervisor_name79@email.com',
        password: 'supervisor-123pass__word',
        role: UserRole.Supervisor,
    },
} as Supervisor;

export const ALTERNATIVE_SUPERVISOR = {
    name: 'Different Supervisor Name',
    user: {
        email: 'anothersupervisor_name123@email.com',
        password: 'anothersupervisor123Password*',
        role: UserRole.Supervisor,
    },
} as Supervisor;

export const DEFAULT_SUPERVISOR_WITHOUT_PASSWORD = {
    ...DEFAULT_SUPERVISOR,
    user: testingUtils.getUserWithoutPassword(DEFAULT_SUPERVISOR.user),
};

export const DEFAULT_STUDENT = {
    fullName: 'Student Name',
    user: {
        email: 'student_name79@email.com',
        password: 'student-123pass__word',
        role: UserRole.Student,
    },
} as Student;

export const ALTERNATIVE_STUDENT = {
    fullName: 'Different Student Name',
    user: {
        email: 'anotherStudent_name123@email.com',
        password: 'anotherStudent123Password*',
        role: UserRole.Student,
    },
} as Student;

export const DEFAULT_STUDENT_WITHOUT_PASSWORD = {
    ...DEFAULT_STUDENT,
    user: testingUtils.getUserWithoutPassword(DEFAULT_STUDENT.user),
};

export default testingUtils;
