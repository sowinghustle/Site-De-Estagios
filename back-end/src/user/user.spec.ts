import { requestWithSupertest, TestingUtils } from '../config/testing';
import { DatabaseResolver } from '../database';
import { UserRole } from './model';

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
            .get('/api/v1/user/me')
            .set('Cookie', `token=${loginRes.body.token}`)
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
            .get('/api/v1/user/me')
            .set('Cookie', `token=${loginRes.body.token}`)
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
            .get('/api/v1/user/me')
            .set('Cookie', `token=${loginRes.body.token}`)
            .send();
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject(expectedResultValue);
    });

    it('should get unauthorized if user not logged in', async () => {
        const res = await requestWithSupertest.get('/api/v1/user/me').send();
        expect(res.status).toEqual(401);
    });
});
