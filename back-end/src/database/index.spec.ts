import { DatabaseConnection, DatabaseResolver } from '.';
import { Admin } from '../admin/model';
import instituition from '../config/instituition';
import { UserToken } from '../token/model';

const saveAdmin = async (
    conn: DatabaseConnection,
    props?: { name?: string; email?: string; password?: string }
): Promise<Admin | undefined | Error> => {
    const admin: Admin = {
        name: props?.name ?? 'randomAdminName23215',
        user: {
            email: props?.email ?? 'randomAdminEmail@email.com',
            password: props?.password ?? 'randomPassword*4812',
        },
    };

    return await conn.saveNewAdmin(admin).catch((err) => err);
};

describe('Database', () => {
    beforeEach(() => DatabaseResolver.reset());

    describe('admin', () => {
        it('should save a new admin sucesfully', async () => {
            const conn = await DatabaseResolver.getConnection();
            const result = await saveAdmin(conn);

            expect(result).toMatchObject<Admin>({
                name: 'randomAdminName23215',
                user: {
                    email: 'randomAdminEmail@email.com',
                    password: 'randomPassword*4812',
                },
            });
            expect(conn.getError()).toBeUndefined();
        });

        it('should not save admin with duplicated name', async () => {
            const conn = await DatabaseResolver.getConnection();

            expect(await saveAdmin(conn)).not.toBeInstanceOf(Error);
            expect(
                await saveAdmin(conn, { email: instituition.adminEmail })
            ).toBeUndefined();
            expect(conn.getError()).toBeInstanceOf(Error);
        });

        it('should not save admin with duplicated email', async () => {
            const conn = await DatabaseResolver.getConnection();

            expect(await saveAdmin(conn)).not.toBeInstanceOf(Error);
            expect(
                await saveAdmin(conn, { name: instituition.adminName })
            ).toBeUndefined();
            expect(conn.getError()).toBeInstanceOf(Error);
        });

        it('should not save admin with empty name', async () => {
            const conn = await DatabaseResolver.getConnection();

            expect(await saveAdmin(conn, { name: '' })).toBeUndefined();
            expect(conn.getError()).toBeInstanceOf(Error);
        });

        it('should not save admin with empty email', async () => {
            const conn = await DatabaseResolver.getConnection();

            expect(await saveAdmin(conn, { email: '' })).toBeUndefined();
            expect(conn.getError()).toBeInstanceOf(Error);
        });

        it('should get admin by name', async () => {
            const conn = await DatabaseResolver.getConnection();
            await saveAdmin(conn);

            expect(
                await conn
                    .findAdminByNameOrEmail('randomAdminName23215')
                    .catch((err) => err)
            ).toMatchObject<Admin>({
                name: 'randomAdminName23215',
                user: {
                    email: 'randomAdminEmail@email.com',
                    password: 'randomPassword*4812',
                },
            });
        });

        it('should get admin by email', async () => {
            const conn = await DatabaseResolver.getConnection();
            await saveAdmin(conn);

            expect(
                await conn
                    .findAdminByNameOrEmail('randomAdminEmail@email.com')
                    .catch((err) => err)
            ).toMatchObject<Admin>({
                name: 'randomAdminName23215',
                user: {
                    email: 'randomAdminEmail@email.com',
                    password: 'randomPassword*4812',
                },
            });
        });

        it('should not get admin with wrong name or email', async () => {
            const conn = await DatabaseResolver.getConnection();
            await saveAdmin(conn);

            expect(
                await conn
                    .findAdminByNameOrEmail('differentRandomAdminName23215')
                    .catch((err) => err)
            ).toBeUndefined();
        });

        it('should save a new user token sucessfully', async () => {
            const conn = await DatabaseResolver.getConnection();
            const admin = await saveAdmin(conn);

            expect(admin).not.toBeUndefined();
            expect(admin).not.toBeInstanceOf(Error);

            if (admin != undefined && !(admin instanceof Error)) {
                const result = await conn
                    .saveNewUserToken('randomToken153412', admin.user.id!)
                    .catch((err) => err);

                expect(result).toMatchObject({ token: 'randomToken153412' });
                expect(result?.expiredAt).toBeUndefined();
            }

            expect(conn.getError()).not.toBe(Error);
        });

        it('should invalidate a user token sucessfully', async () => {
            const conn = await DatabaseResolver.getConnection();
            const admin = await saveAdmin(conn);

            expect(admin).not.toBeUndefined();
            expect(admin).not.toBeInstanceOf(Error);

            if (admin != undefined && !(admin instanceof Error)) {
                await conn
                    .saveNewUserToken('randomToken153412', admin.user.id!)
                    .catch((err) => err);

                const result =
                    await conn.invalidateUserToken('randomToken153412');

                expect(result).toMatchObject({ token: 'randomToken153412' });
                expect(result?.expiredAt).toBeInstanceOf(Date);
            }

            expect(conn.getError()).not.toBe(Error);
        });
    });
});
