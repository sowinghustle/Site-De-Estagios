import { randomUUID } from 'crypto';
import supertest from 'supertest';
import config from '.';
import { Admin } from '../admin/model';
import adminService from '../admin/service';
import app from '../app';
import hashService from '../hash/service';
import { Student } from '../student/model';
import studentService from '../student/service';
import { Supervisor } from '../supervisor/model';
import supervisorService from '../supervisor/service';
import { User } from '../user/model';

export const requestWithSupertest = supertest(app);
export const token = randomUUID();

jest.mock('../token/service', () => {
    return {
        generateUserToken: () => token,
    };
});

export const TestingUtils = Object.freeze({
    DEFAULT_ADMIN: {
        name: config.instituition.adminName,
        user: {
            email: config.instituition.adminEmail,
            password: config.instituition.adminPassword,
        },
    } as Admin,
    ALTERNATIVE_ADMIN: {
        name: 'differentName23',
        user: {
            email: 'differentEmail23@email.com',
            password: 'different_Password 123',
        },
    } as Admin,
    get DEFAULT_ADMIN_WITHOUT_PASSWORD() {
        return {
            ...this.DEFAULT_ADMIN,
            user: this.getUserWithoutPassword(this.DEFAULT_ADMIN.user),
        };
    },
    DEFAULT_SUPERVISOR: {
        name: 'Supervisor Name',
        user: {
            email: 'supervisor_name79@email.com',
            password: 'supervisor-123pass__word',
        },
    } as Supervisor,
    ALTERNATIVE_SUPERVISOR: {
        name: 'Different Supervisor Name',
        user: {
            email: 'anothersupervisor_name123@email.com',
            password: 'anothersupervisor123Password*',
        },
    } as Supervisor,
    get DEFAULT_SUPERVISOR_WITHOUT_PASSWORD() {
        return {
            ...this.DEFAULT_SUPERVISOR,
            user: this.getUserWithoutPassword(this.DEFAULT_SUPERVISOR.user),
        };
    },
    DEFAULT_STUDENT: {
        fullName: 'Student Name',
        user: {
            email: 'student_name79@email.com',
            password: 'student-123pass__word',
        },
    } as Student,
    ALTERNATIVE_STUDENT: {
        fullName: 'Different Student Name',
        user: {
            email: 'anotherStudent_name123@email.com',
            password: 'anotherStudent123Password*',
        },
    } as Student,
    get DEFAULT_STUDENT_WITHOUT_PASSWORD() {
        return {
            ...this.DEFAULT_STUDENT,
            user: this.getUserWithoutPassword(this.DEFAULT_STUDENT.user),
        };
    },
    async getUserWithEncryptedPassword(user: User): Promise<User> {
        return {
            ...user,
            password: await hashService.encryptPassword(user.password),
        };
    },
    async getUserWithoutPassword(user: User): Promise<Omit<User, 'password'>> {
        const newUser = { ...user } as any;
        delete newUser.password;
        return newUser;
    },
    async saveAdmin(data: Admin) {
        return await adminService.saveNewAdmin(data);
    },
    async saveAndTestAdmin(data: Admin) {
        const expectedAdminValue = this.DEFAULT_ADMIN_WITHOUT_PASSWORD;
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
    async saveSupervisor(data: Supervisor) {
        return await supervisorService.saveNewSupervisor(data);
    },
    async saveAndTestSupervisor(data: Supervisor) {
        const expectedSupervisorValue =
            this.DEFAULT_SUPERVISOR_WITHOUT_PASSWORD;
        const result = await this.saveSupervisor(data);
        expect(result.isError).toBe(false);
        expect(result.value).toMatchObject(expectedSupervisorValue);
        return result.value as Supervisor;
    },
    async saveStudent(data: Student) {
        return await studentService.saveNewStudent(data);
    },
    async saveAndTestStudent(data: Student) {
        const expectedStudentValue = this.DEFAULT_STUDENT_WITHOUT_PASSWORD;
        const result = await this.saveStudent(data);
        expect(result.isError).toBe(false);
        expect(result.value).toMatchObject(expectedStudentValue);
        return result.value as Student;
    },
    testAuthResponseCookies(res: any) {
        const cookies = res.headers['set-cookie'];

        expect(Array.isArray(cookies)).toBe(true);

        for (let key of [`token=${token}`, 'HttpOnly'])
            expect(cookies[0]).toContain(key);
    },
    async expectPromiseNotToReject<T>(promise: Promise<T>) {
        await expect(promise.then(() => true).catch(() => false)).resolves.toBe(
            true
        );
        return await promise;
    },
});
