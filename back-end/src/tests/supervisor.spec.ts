import config from '../modules/config';
import testingUtils, {
    ALTERNATIVE_SUPERVISOR,
    DEFAULT_SUPERVISOR,
    requestWithSupertest,
} from '../modules/config/testing';
import { DatabaseResolver } from '../modules/database';

describe('POST /supervisor/login', () => {
    beforeEach(() => DatabaseResolver.reset());

    it('should authenticate supervisor sucessfully', async () => {
        const expectedResultValue = {
            success: true,
            message: config.messages.successfullLogin,
            token: testingUtils.token,
        };
        await testingUtils.saveAndTestSupervisor(DEFAULT_SUPERVISOR);
        const res = await requestWithSupertest
            .post('/api/v1/supervisor/login')
            .send({
                email: DEFAULT_SUPERVISOR.user.email,
                password: DEFAULT_SUPERVISOR.user.password,
            });
        expect(res.body).toMatchObject(expectedResultValue);
        testingUtils.testAuthResponseCookies(res);
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
                name: DEFAULT_SUPERVISOR.name,
                email: DEFAULT_SUPERVISOR.user.email,
                password: DEFAULT_SUPERVISOR.user.password,
                repeatPassword: DEFAULT_SUPERVISOR.user.password,
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
                name: DEFAULT_SUPERVISOR.name,
                email: DEFAULT_SUPERVISOR.user.email,
                password: DEFAULT_SUPERVISOR.user.password,
                repeatPassword: ALTERNATIVE_SUPERVISOR.user.password,
            });
        expect(res.body).toMatchObject(expectedResultValue);
        expect(res.status).toEqual(400);
    });
});
