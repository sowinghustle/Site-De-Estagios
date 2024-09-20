import config from '../config';
import { requestWithSupertest, TestingUtils, token } from '../config/testing';
import { DatabaseResolver } from '../database';

describe('POST /supervisor/login', () => {
    beforeEach(() => DatabaseResolver.reset());

    it('should authenticate supervisor sucessfully', async () => {
        const expectedResultValue = {
            success: true,
            message: config.messages.successfullLogin,
            token,
        };
        await TestingUtils.saveAndTestSupervisor(
            TestingUtils.DEFAULT_SUPERVISOR
        );
        const res = await requestWithSupertest
            .post('/api/v1/supervisor/login')
            .send({
                email: TestingUtils.DEFAULT_SUPERVISOR.user.email,
                password: TestingUtils.DEFAULT_SUPERVISOR.user.password,
            });
        expect(res.body).toMatchObject(expectedResultValue);
        TestingUtils.testAuthResponseCookies(res);
        expect(res.status).toEqual(200);
    });
});

describe('POST /supervisor/register', () => {
    beforeEach(() => DatabaseResolver.reset());

    it('should create supervisor sucessfully', async () => {
        const expectedResultValue = {
            success: true,
            message: config.messages.successfullRegister,
        };
        const res = await requestWithSupertest
            .post('/api/v1/supervisor/register')
            .send({
                name: TestingUtils.DEFAULT_SUPERVISOR.name,
                email: TestingUtils.DEFAULT_SUPERVISOR.user.email,
                password: TestingUtils.DEFAULT_SUPERVISOR.user.password,
                repeatPassword: TestingUtils.DEFAULT_SUPERVISOR.user.password,
            });
        expect(res.body).toMatchObject(expectedResultValue);
        expect(res.status).toEqual(201);
    });

    it('should not register a supervisor when repeat-password doesnt match password', async () => {
        const expectedResultValue = {
            success: false,
            message: config.messages.wrongRepeatPassword,
        };
        const res = await requestWithSupertest
            .post('/api/v1/supervisor/register')
            .send({
                name: TestingUtils.DEFAULT_SUPERVISOR.name,
                email: TestingUtils.DEFAULT_SUPERVISOR.user.email,
                password: TestingUtils.DEFAULT_SUPERVISOR.user.password,
                repeatPassword:
                    TestingUtils.ALTERNATIVE_SUPERVISOR.user.password,
            });
        expect(res.body).toMatchObject(expectedResultValue);
        expect(res.status).toEqual(400);
    });
});
