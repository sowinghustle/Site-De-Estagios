import config from '../config';
import {
    alternativeStudent,
    defaultStudent,
    requestWithSupertest,
    saveAndTestStudent,
    testAuthResponseCookies,
    token,
} from '../config/testing';
import { DatabaseResolver } from '../database';

describe('POST /student/login', () => {
    beforeEach(() => DatabaseResolver.reset());

    it('should authenticate student sucessfully', async () => {
        const expectedResultValue = {
            success: true,
            message: config.messages.successfullLogin,
            token,
        };
        const conn = await DatabaseResolver.getConnection();
        await saveAndTestStudent(conn, defaultStudent);
        const res = await requestWithSupertest
            .post('/api/v1/student/login')
            .send({
                email: defaultStudent.user.email,
                password: defaultStudent.user.password,
            });
        expect(res.body).toMatchObject(expectedResultValue);
        testAuthResponseCookies(res);
        expect(res.status).toEqual(200);
    });
});

describe('POST /student/register', () => {
    beforeEach(() => DatabaseResolver.reset());

    it('should create student sucessfully', async () => {
        const expectedResultValue = {
            success: true,
            message: config.messages.successfullRegister,
        };
        const res = await requestWithSupertest
            .post('/api/v1/student/register')
            .send({
                fullName: defaultStudent.fullName,
                email: defaultStudent.user.email,
                password: defaultStudent.user.password,
                repeatPassword: defaultStudent.user.password,
            });
        expect(res.body).toMatchObject(expectedResultValue);
        expect(res.status).toEqual(201);
    });

    it('should not register a student when repeat-password doesnt match password', async () => {
        const expectedResultValue = {
            success: false,
            message: config.messages.wrongRepeatPassword,
        };
        const res = await requestWithSupertest
            .post('/api/v1/student/register')
            .send({
                fullName: defaultStudent.fullName,
                email: defaultStudent.user.email,
                password: defaultStudent.user.password,
                repeatPassword: alternativeStudent.user.password,
            });
        expect(res.body).toMatchObject(expectedResultValue);
        expect(res.status).toEqual(400);
    });
});
