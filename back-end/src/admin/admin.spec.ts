import config from '../config';
import {
    alternativeAdmin,
    defaultAdmin,
    requestWithSupertest,
    saveAndTestAdmin,
    testAuthResponseCookies,
    token,
} from '../config/testing';
import { DatabaseResolver } from '../database';

describe('POST /admin/login', () => {
    beforeEach(() => DatabaseResolver.reset());

    describe('should authenticate admin successfully', () => {
        it('with correct name and password', async () => {
            const expectedResultValue = {
                success: true,
                message: config.messages.successfullLogin,
                token,
            };
            const conn = await DatabaseResolver.getConnection();
            await saveAndTestAdmin(conn, defaultAdmin);
            const res = await requestWithSupertest
                .post('/api/v1/admin/login')
                .send({
                    nameOrEmail: defaultAdmin.name,
                    password: defaultAdmin.user.password,
                });
            expect(res.body).toMatchObject(expectedResultValue);
            testAuthResponseCookies(res);
            expect(res.status).toEqual(200);
        });

        it('with correct email and password', async () => {
            const expectedResultValue = {
                success: true,
                message: config.messages.successfullLogin,
                token,
            };
            const conn = await DatabaseResolver.getConnection();
            await saveAndTestAdmin(conn, defaultAdmin);
            const res = await requestWithSupertest
                .post('/api/v1/admin/login')
                .send({
                    nameOrEmail: defaultAdmin.user.email,
                    password: defaultAdmin.user.password,
                });
            expect(res.body).toMatchObject(expectedResultValue);
            testAuthResponseCookies(res);
            expect(res.status).toEqual(200);
        });
    });

    describe('should throw error', () => {
        it('when name or email is not provided', async () => {
            const expectedResultValue = {
                success: false,
                message: config.messages.emptyNameOrEmail,
            };
            const res = await requestWithSupertest.post('/api/v1/admin/login');
            expect(res.body).toMatchObject(expectedResultValue);
            expect(res.status).toEqual(400);
        });

        it('when password is not provided', async () => {
            const expectedResultValue = {
                success: false,
                message: config.messages.emptyPassword,
            };
            const res = await requestWithSupertest
                .post('/api/v1/admin/login')
                .send({
                    nameOrEmail: defaultAdmin.name,
                });
            expect(res.body).toMatchObject(expectedResultValue);
            expect(res.status).toEqual(400);
        });

        it('when admin is not found', async () => {
            const expectedResultValue = {
                success: false,
                message: config.messages.adminNotFoundWithNameOrEmail,
            };
            const res = await requestWithSupertest
                .post('/api/v1/admin/login')
                .send({
                    nameOrEmail: defaultAdmin.name,
                    password: defaultAdmin.user.password,
                });
            expect(res.body).toMatchObject(expectedResultValue);
            expect(res.status).toEqual(400);
        });

        it('when provided password is wrong', async () => {
            const expectedResultValue = {
                success: false,
                message: config.messages.wrongPassword,
            };
            const conn = await DatabaseResolver.getConnection();
            await saveAndTestAdmin(conn, defaultAdmin);
            const res = await requestWithSupertest
                .post('/api/v1/admin/login')
                .send({
                    nameOrEmail: defaultAdmin.name,
                    password: alternativeAdmin.user.password,
                });
            expect(res.body).toMatchObject(expectedResultValue);
            expect(res.status).toEqual(400);
        });

        it('when provided password has less characters than necessary', async () => {
            const expectedResultValue = {
                success: false,
                message: config.messages.insuficientPasswordCharacters,
            };
            const res = await requestWithSupertest
                .post('/api/v1/admin/login')
                .send({
                    nameOrEmail: config.instituition.adminEmail,
                    password: 'r',
                });
            expect(res.body).toMatchObject(expectedResultValue);
            expect(res.status).toEqual(400);
        });
    });
});
