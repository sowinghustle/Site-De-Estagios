import { requestWithSupertest, TestingUtils } from '../config/testing';
import { DatabaseResolver } from '../database';

describe('POST /admin/logout', () => {
    beforeEach(() => DatabaseResolver.reset());

    it('should successfully log out the admin', async () => {
        await TestingUtils.saveAndTestAdmin(TestingUtils.DEFAULT_ADMIN);

        const loginRes = await TestingUtils.authenticateAdmin(
            TestingUtils.DEFAULT_ADMIN.name,
            TestingUtils.DEFAULT_ADMIN.user.password
        );
        const res = await requestWithSupertest
            .delete(`/api/v1/logout?access_token=${loginRes.body.token}`)
            .send();
        expect(res.status).toEqual(204);
    });

    describe('should not log-out', () => {
        it('when an invalid token is provided', async () => {
            const res = await requestWithSupertest
                .delete('/api/v1/logout?access_token=invalidToken123')
                .send();

            expect(res.status).toEqual(401);
        });

        it('when user is not authenticated', async () => {
            const res = await requestWithSupertest.delete('/api/v1/logout');
            expect(res.status).toEqual(401);
        });

        it('when admin token was invalidated', async () => {
            const admin = TestingUtils.DEFAULT_ADMIN;
            await TestingUtils.saveAndTestAdmin(admin);
            const loginRes = await TestingUtils.authenticateAdmin(
                admin.name,
                admin.user.password
            );
            expect(loginRes.status).toEqual(200);

            const logoutRes = await requestWithSupertest
                .delete(`/api/v1/logout?access_token=${loginRes.body.token}`)
                .send();
            expect(logoutRes.status).toEqual(204);

            const res = await requestWithSupertest
                .get('/api/v1/user/me')
                .set('Cookie', `token=${loginRes.body.token}`)
                .send();
            expect(res.status).toEqual(401);
        });

        it('when supervisor token was invalidated', async () => {
            const supervisor = TestingUtils.DEFAULT_SUPERVISOR;
            await TestingUtils.saveAndTestSupervisor(supervisor);
            const loginRes = await TestingUtils.authenticateSupervisor(
                supervisor.user.email,
                supervisor.user.password
            );
            expect(loginRes.status).toEqual(200);

            const logoutRes = await requestWithSupertest
                .delete(`/api/v1/logout?access_token=${loginRes.body.token}`)
                .send();
            expect(logoutRes.status).toEqual(204);

            const res = await requestWithSupertest
                .get(`/api/v1/user/me?access_token=${loginRes.body.token}`)
                .send();
            expect(res.status).toEqual(401);
        });

        it('when student token was invalidated', async () => {
            const student = TestingUtils.DEFAULT_STUDENT;
            await TestingUtils.saveAndTestStudent(student);
            const loginRes = await TestingUtils.authenticateStudent(
                student.user.email,
                student.user.password
            );
            expect(loginRes.status).toEqual(200);

            const logoutRes = await requestWithSupertest
                .delete(`/api/v1/logout?access_token=${loginRes.body.token}`)
                .send();
            expect(logoutRes.status).toEqual(204);

            const res = await requestWithSupertest
                .get(`/api/v1/user/me?access_token=${loginRes.body.token}`)
                .send();
            expect(res.status).toEqual(401);
        });
    });
});
