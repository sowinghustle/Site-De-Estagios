import config from '../modules/config';
import testingUtils, {
    ALTERNATIVE_STUDENT,
    DEFAULT_STUDENT,
    requestWithSupertest,
} from '../modules/config/testing';
import { DatabaseResolver } from '../modules/database';

describe('POST /student/login', () => {
    beforeEach(() => DatabaseResolver.reset());

    it('should authenticate student sucessfully', async () => {
        const expectedResultValue = {
            success: true,
            message: config.messages.successfullLogin,
            token: testingUtils.token,
        };
        await testingUtils.saveAndTestStudent(DEFAULT_STUDENT);
        const res = await requestWithSupertest
            .post('/api/v1/student/login')
            .send({
                email: DEFAULT_STUDENT.user.email,
                password: DEFAULT_STUDENT.user.password,
            });
        expect(res.body).toMatchObject(expectedResultValue);
        testingUtils.testAuthResponseCookies(res);
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
                fullName: DEFAULT_STUDENT.fullName,
                email: DEFAULT_STUDENT.user.email,
                password: DEFAULT_STUDENT.user.password,
                repeatPassword: DEFAULT_STUDENT.user.password,
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
                fullName: DEFAULT_STUDENT.fullName,
                email: DEFAULT_STUDENT.user.email,
                password: DEFAULT_STUDENT.user.password,
                repeatPassword: ALTERNATIVE_STUDENT.user.password,
            });
        expect(res.body).toMatchObject(expectedResultValue);
        expect(res.status).toEqual(400);
    });
});
