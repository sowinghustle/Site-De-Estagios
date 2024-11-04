import { UserRole } from '../models/user';
import {
    requestWithSupertest,
    TestingUtils,
    token,
} from '../modules/config/testing';
import { DatabaseResolver } from '../modules/database';

describe('GET /user/me', () => {
    beforeEach(() => DatabaseResolver.reset());

    it('should get data when admin is logged in', async () => {
        const admin = TestingUtils.DEFAULT_ADMIN;
        const expectedResultValue = {
            success: true,
            user: {
                email: admin.user.email,
                role: UserRole.Adm,
            },
        };
        await TestingUtils.saveAndTestAdmin(admin);
        const loginRes = await TestingUtils.authenticateAdmin(
            admin.name,
            admin.user.password
        );
        const res = await requestWithSupertest
            .get(`/api/v1/user/me?access_token=${loginRes.body.token}`)
            .send();
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject(expectedResultValue);
    });

    it('should get data when supervisor is logged in', async () => {
        const supervisor = TestingUtils.DEFAULT_SUPERVISOR;
        const expectedResultValue = {
            success: true,
            user: {
                email: supervisor.user.email,
                role: UserRole.Supervisor,
            },
        };
        await TestingUtils.saveAndTestSupervisor(supervisor);
        const loginRes = await TestingUtils.authenticateSupervisor(
            supervisor.user.email,
            supervisor.user.password
        );
        const res = await requestWithSupertest
            .get(`/api/v1/user/me?access_token=${loginRes.body.token}`)
            .send();
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject(expectedResultValue);
    });

    it('should get data when student is logged in', async () => {
        const student = TestingUtils.DEFAULT_STUDENT;
        const expectedResultValue = {
            success: true,
            user: {
                email: student.user.email,
                role: UserRole.Student,
            },
        };
        await TestingUtils.saveAndTestStudent(student);
        const loginRes = await TestingUtils.authenticateStudent(
            student.user.email,
            student.user.password
        );
        const res = await requestWithSupertest
            .get(`/api/v1/user/me?access_token=${loginRes.body.token}`)
            .send();
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject(expectedResultValue);
    });

    it('should get unauthorized if user not logged in', async () => {
        const res = await requestWithSupertest.get('/api/v1/user/me').send();
        expect(res.status).toEqual(401);
    });

    it('should reset student password', async () => {
        const student = TestingUtils.DEFAULT_STUDENT;
        const expectedResultValue = { success: true };

        await TestingUtils.saveAndTestStudent(student);

        const forgotPasswordRes = await requestWithSupertest
            .post('/api/v1/user/forgot-password')
            .send({ email: student.user.email });
        expect(forgotPasswordRes.status).toEqual(200);
        expect(forgotPasswordRes.body).toMatchObject(expectedResultValue);

        const res = await requestWithSupertest
            .post('/api/v1/user/reset-password')
            .send({
                email: student.user.email,
                token,
                newPassword: TestingUtils.ALTERNATIVE_STUDENT.user.password,
            });
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject(expectedResultValue);

        const loginRes = await TestingUtils.authenticateStudent(
            student.user.email,
            TestingUtils.ALTERNATIVE_STUDENT.user.password
        );
        expect(loginRes.status).toEqual(200);
    });

    it('should not reset student password with invalid token', async () => {
        const student = TestingUtils.DEFAULT_STUDENT;
        const expectedResultValue = { success: false };

        await TestingUtils.saveAndTestStudent(student);

        const forgotPasswordRes = await requestWithSupertest
            .post('/api/v1/user/forgot-password')
            .send({ email: student.user.email });
        expect(forgotPasswordRes.status).toEqual(200);
        expect(forgotPasswordRes.body).toMatchObject({ success: true });

        const res = await requestWithSupertest
            .post('/api/v1/user/reset-password')
            .send({
                email: student.user.email,
                token: 'invalid_reset_password_token',
                newPassword: TestingUtils.ALTERNATIVE_STUDENT.user.password,
            });
        expect(res.status).toEqual(404);
        expect(res.body).toMatchObject(expectedResultValue);

        const loginRes = await TestingUtils.authenticateStudent(
            student.user.email,
            TestingUtils.ALTERNATIVE_STUDENT.user.password
        );
        expect(loginRes.status).toEqual(400);
    });

    it('should not reset student password with invalid email', async () => {
        const student = TestingUtils.DEFAULT_STUDENT;
        const expectedResultValue = { success: false };

        await TestingUtils.saveAndTestStudent(student);

        const forgotPasswordRes = await requestWithSupertest
            .post('/api/v1/user/forgot-password')
            .send({ email: student.user.email });
        expect(forgotPasswordRes.status).toEqual(200);
        expect(forgotPasswordRes.body).toMatchObject({ success: true });

        const res = await requestWithSupertest
            .post('/api/v1/user/reset-password')
            .send({
                email: TestingUtils.ALTERNATIVE_STUDENT.user.email,
                token,
                newPassword: TestingUtils.ALTERNATIVE_STUDENT.user.password,
            });
        expect(res.status).toEqual(404);
        expect(res.body).toMatchObject(expectedResultValue);

        const loginRes = await TestingUtils.authenticateStudent(
            student.user.email,
            TestingUtils.ALTERNATIVE_STUDENT.user.password
        );
        expect(loginRes.status).toEqual(400);
    });
});
