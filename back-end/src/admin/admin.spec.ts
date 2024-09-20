import instituition from '../config/instituition';
import respMessages from '../config/responseMessages';
import { DatabaseResolver } from '../database';
import { requestWithSupertest, token } from '../utils/testing';

describe('Admin', () => {
    beforeEach(() => DatabaseResolver.reset());

    describe('POST /admin/login', () => {
        describe('should return error when', () => {
            it("name or email isn't provided", async () => {
                const res = await requestWithSupertest.post(
                    '/api/v1/admin/login'
                );
                expect(res.body).toMatchObject({
                    success: false,
                    message: respMessages.emptyNameOrEmail,
                });
                expect(res.status).toEqual(400);
            });

            it("password isn't provided", async () => {
                const res = await requestWithSupertest
                    .post('/api/v1/admin/login')
                    .send({
                        nameOrEmail: 'Random Username',
                    });
                expect(res.body).toMatchObject({
                    success: false,
                    message: respMessages.emptyPassword,
                });
                expect(res.status).toEqual(400);
            });

            it("name isn't valid", async () => {
                const res = await requestWithSupertest
                    .post('/api/v1/admin/login')
                    .send({
                        nameOrEmail: 'random123241',
                        password: 'randomPassword41512233',
                    });
                expect(res.body).toMatchObject({
                    success: false,
                    message: respMessages.nameOnlyLetters,
                });
                expect(res.status).toEqual(400);
            });
        });

        it('should return user not found', async () => {
            const res = await requestWithSupertest
                .post('/api/v1/admin/login')
                .send({
                    nameOrEmail: 'Random Username',
                    password: 'randomPassword41512233',
                });
            expect(res.body).toMatchObject({
                success: false,
                message: respMessages.adminNotFoundWithNameOrEmail,
            });
            expect(res.status).toEqual(400);
        });

        it('should fail with wrong password', async () => {
            const res = await requestWithSupertest
                .post('/api/v1/admin/login')
                .send({
                    nameOrEmail: instituition.adminEmail,
                    password: 'randomPassword41512233',
                });
            expect(res.body).toMatchObject({
                success: false,
                message: respMessages.wrongPassword,
            });
            expect(res.status).toEqual(400);
        });

        it('should fail with less characters than necessary', async () => {
            const res = await requestWithSupertest
                .post('/api/v1/admin/login')
                .send({
                    nameOrEmail: instituition.adminEmail,
                    password: 'rand',
                });
            expect(res.body).toMatchObject({
                success: false,
                message: respMessages.insuficientPasswordCharacters,
            });
            expect(res.status).toEqual(400);
        });

        describe('should return success and complete login with cookies', () => {
            const testResponseCookies = (res: any) => {
                const cookies = res.headers['set-cookie'];

                for (let key of [`token=${token}`, 'HttpOnly'])
                    expect(cookies[0]).toContain(key);
            };

            it('with email and password', async () => {
                const res = await requestWithSupertest
                    .post('/api/v1/admin/login')
                    .send({
                        nameOrEmail: instituition.adminEmail,
                        password: instituition.adminPassword,
                    });

                testResponseCookies(res);

                expect(res.body).toMatchObject({
                    success: true,
                    message: respMessages.successfullLogin,
                    token,
                });
                expect(res.body).toHaveProperty('expiresAt');
                expect(res.body).toHaveProperty('token');
                expect(res.status).toEqual(200);
            });

            it('with name and password', async () => {
                const res = await requestWithSupertest
                    .post('/api/v1/admin/login')
                    .send({
                        nameOrEmail: instituition.adminName,
                        password: instituition.adminPassword,
                    });

                testResponseCookies(res);

                expect(res.body).toHaveProperty('expiresAt');
                expect(res.body).toMatchObject({
                    success: true,
                    message: respMessages.successfullLogin,
                    token,
                });

                expect(res.status).toEqual(200);
            });
        });
    });
});
