import instituition from '../config/instituition';
import respMessages from '../config/responseMessages';
import { DatabaseResolver } from '../database';
import { requestWithSupertest, token } from '../utils/testing';

describe('Admin', () => {
    beforeEach(() => DatabaseResolver.reset());

    describe('POST /admin/login', () => {
        it('should return error', async () => {
            const res = await requestWithSupertest.post('/api/v1/admin/login');
            expect(res.body).toHaveProperty('message');
            expect(res.body).toMatchObject({ success: false });
            expect(res.status).toEqual(400);
        });

        it('should return user not found', async () => {
            const res = await requestWithSupertest
                .post('/api/v1/admin/login')
                .send({
                    nameOrEmail: 'randomUser31523',
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

        describe('should return success and complete login with cookies', () => {
            it('with email and password', async () => {
                const res = await requestWithSupertest
                    .post('/api/v1/admin/login')
                    .send({
                        nameOrEmail: instituition.adminEmail,
                        password: instituition.adminPassword,
                    });

                const cookies = res.headers['set-cookie'];

                expect(res.body).toMatchObject({
                    success: true,
                    message: respMessages.successfullLogin,
                    token,
                });
                expect(res.body).toHaveProperty('expiresAt');
                expect(res.status).toEqual(200);
                expect(cookies).toContain(`token=${token}; Path=/`);
            });

            it('with name and password', async () => {
                const res = await requestWithSupertest
                    .post('/api/v1/admin/login')
                    .send({
                        nameOrEmail: instituition.adminName,
                        password: instituition.adminPassword,
                    });

                const cookies = res.headers['set-cookie'];

                expect(res.body).toMatchObject({
                    success: true,
                    message: respMessages.successfullLogin,
                    token,
                });
                expect(res.body).toHaveProperty('expiresAt');
                expect(res.status).toEqual(200);
                expect(cookies).toContain(`token=${token}; Path=/`);
            });
        });
    });
});
