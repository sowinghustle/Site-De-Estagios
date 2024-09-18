import config from '../config';
import {
    alternativeSupervisor,
    defaultSupervisor,
    requestWithSupertest,
    saveAndTestSupervisor,
    testAuthResponseCookies,
    token,
} from '../config/testing';
import { DatabaseResolver } from '../database';

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
                name: defaultSupervisor.name,
                email: defaultSupervisor.user.email,
                password: defaultSupervisor.user.password,
                repeatPassword: defaultSupervisor.user.password,
            });
        expect(res.body).toMatchObject(expectedResultValue);
        expect(res.status).toEqual(201);
    });

    it('should authenticate supervisor sucessfully', async () => {
        const expectedResultValue = {
            success: true,
            message: config.messages.successfullLogin,
            token,
        };
        const conn = await DatabaseResolver.getConnection();
        await saveAndTestSupervisor(conn, defaultSupervisor);
        const res = await requestWithSupertest
            .post('/api/v1/supervisor/login')
            .send({
                email: defaultSupervisor.user.email,
                password: defaultSupervisor.user.password,
            });
        expect(res.body).toMatchObject(expectedResultValue);
        testAuthResponseCookies(res);
        expect(res.status).toEqual(200);
    });

    it('should not register a supervisor when repeat-password doesnt match password', async () => {
        const expectedResultValue = {
            success: false,
            message: config.messages.wrongRepeatPassword,
        };
        const res = await requestWithSupertest
            .post('/api/v1/supervisor/register')
            .send({
                name: defaultSupervisor.name,
                email: defaultSupervisor.user.email,
                password: defaultSupervisor.user.password,
                repeatPassword: alternativeSupervisor.user.password,
            });
        expect(res.body).toMatchObject(expectedResultValue);
        expect(res.status).toEqual(400);
    });
});
