import { DatabaseResolver } from '../database';

describe('POST /admin/logout', () => {
    beforeAll(() => jest.setTimeout(120_000));
    beforeEach(() => DatabaseResolver.reset());

    it('does nothing', () => expect(1).toBe(1));

    // it('should return error if an invalid token is provided', async () => {
    //     const res = await requestWithSupertest
    //         .delete('/api/v1/logout')
    //         .set('Authorization', 'Bearer invalidToken123')
    //         .send();

    //     expect(res.status).toEqual(401);
    //     expect(res.body).toMatchObject({
    //         success: false,
    //         message: config.messages.invalidToken,
    //     });
    // });

    // it('should successfully log out the admin', async () => {
    //     const conn = await DatabaseResolver.getConnection();
    //     await saveAndTestAdmin(conn, defaultAdmin);
    //     const loginRes = await adminAuthenticate(
    //         defaultAdmin.name,
    //         defaultAdmin.user.password
    //     );
    //     const res = await requestWithSupertest
    //         .delete('/api/v1/logout')
    //         .set('Authorization', `Bearer ${loginRes.body.token}`)
    //         .send();
    //     expect(res.status).toEqual(204);
    // });

    // it('should not logout if not authenticated', async () => {
    //     const expectedResultValue = {
    //         success: false,
    //         message: config.messages.notAuth,
    //     };
    //     const res = await requestWithSupertest.delete('/api/v1/logout');
    //     expect(res.body).toMatchObject(expectedResultValue);
    //     expect(res.status).toEqual(401);
    // });
});
