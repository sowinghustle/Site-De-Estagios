import {
    adminAuthenticate,
    defaultAdmin,
    requestWithSupertest,
    saveAndTestAdmin,
} from '../config/testing';
import { DatabaseResolver } from '../database';

describe('POST /admin/logout', () => {
    beforeEach(() => DatabaseResolver.reset());

    it('should successfully log out the admin', async () => {
        const conn = await DatabaseResolver.getConnection();
        await saveAndTestAdmin(conn, defaultAdmin);
        const loginRes = await adminAuthenticate(
            defaultAdmin.name,
            defaultAdmin.user.password
        );
        const res = await requestWithSupertest
            .delete('/api/v1/logout')
            .set('Cookie', `token=${loginRes.body.token}`)
            .send();
        expect(res.status).toEqual(204);
    });

    describe('should not log-out', () => {
        it('when an invalid token is provided', async () => {
            const res = await requestWithSupertest
                .delete('/api/v1/logout')
                .set('Cookie', `token=invalidToken123`)
                .send();

            expect(res.status).toEqual(401);
        });

        it('when user is not authenticated', async () => {
            const res = await requestWithSupertest.delete('/api/v1/logout');
            expect(res.status).toEqual(401);
        });
    });
});
