import config from '../modules/config';
import {
    requestWithSupertest,
    TestingUtils,
    token,
} from '../modules/config/testing';
import { DatabaseResolver } from '../modules/database';

describe('POST /student/login', () => {
    beforeEach(() => DatabaseResolver.reset());

    it('should authenticate student sucessfully', async () => {
        const expectedResultValue = {
            success: true,
            message: config.messages.successfullLogin,
            token,
        };
        await TestingUtils.saveAndTestStudent(TestingUtils.DEFAULT_STUDENT);
        const res = await requestWithSupertest
            .post('/api/v1/student/login')
            .send({
                email: TestingUtils.DEFAULT_STUDENT.user.email,
                password: TestingUtils.DEFAULT_STUDENT.user.password,
            });
        expect(res.body).toMatchObject(expectedResultValue);
        TestingUtils.testAuthResponseCookies(res);
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
                fullName: TestingUtils.DEFAULT_STUDENT.fullName,
                email: TestingUtils.DEFAULT_STUDENT.user.email,
                password: TestingUtils.DEFAULT_STUDENT.user.password,
                repeatPassword: TestingUtils.DEFAULT_STUDENT.user.password,
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
                fullName: TestingUtils.DEFAULT_STUDENT.fullName,
                email: TestingUtils.DEFAULT_STUDENT.user.email,
                password: TestingUtils.DEFAULT_STUDENT.user.password,
                repeatPassword: TestingUtils.ALTERNATIVE_STUDENT.user.password,
            });
        expect(res.body).toMatchObject(expectedResultValue);
        expect(res.status).toEqual(400);
    });
});
