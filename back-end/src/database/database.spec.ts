import { DatabaseResolver } from '.';
import {
    alternativeAdmin,
    defaultAdmin,
    expectPromiseNotToReject,
    saveAdmin,
    saveAndTestAdmin,
} from '../config/testing';
import { UserRole } from '../user/model';

describe('Admin Database Tests', () => {
    beforeEach(() => DatabaseResolver.reset());

    it('should save a new admin', async () => {
        const expectAdminValue = defaultAdmin;
        const conn = await DatabaseResolver.getConnection();
        const { value, error } = await saveAdmin(conn, defaultAdmin);
        expect(value).toMatchObject(expectAdminValue);
        expect(error).toBeUndefined();
    });

    describe('should not save a new admin', () => {
        it('admin name already in use', async () => {
            const conn = await DatabaseResolver.getConnection();
            await saveAndTestAdmin(conn, defaultAdmin);

            const { value, error } = await saveAdmin(conn, {
                ...defaultAdmin,
                user: {
                    ...defaultAdmin.user,
                    email: alternativeAdmin.user.email,
                },
            });
            expect(value).toBeUndefined();
            expect(error).not.toBeUndefined();
        });

        it('specified email already in use', async () => {
            const conn = await DatabaseResolver.getConnection();
            await saveAndTestAdmin(conn, defaultAdmin);

            const { value, error } = await saveAdmin(conn, {
                ...defaultAdmin,
                name: alternativeAdmin.name,
            });

            expect(value).toBeUndefined();
            expect(error).not.toBeUndefined();
        });
    });

    describe('should find admin', () => {
        it('by name field', async () => {
            const expectedResultValue = defaultAdmin;
            const conn = await DatabaseResolver.getConnection();
            await saveAndTestAdmin(conn, defaultAdmin);
            const promise = conn.findAdminByNameOrEmail(defaultAdmin.name);
            await expectPromiseNotToReject(promise);
            await expect(promise).resolves.toMatchObject(expectedResultValue);
        });

        it('by email field', async () => {
            const expectedResultValue = defaultAdmin;
            const conn = await DatabaseResolver.getConnection();
            await saveAndTestAdmin(conn, defaultAdmin);
            const promise = conn.findAdminByNameOrEmail(
                defaultAdmin.user.email
            );
            await expectPromiseNotToReject(promise);
            await expect(promise).resolves.toMatchObject(expectedResultValue);
        });
    });

    describe('should not find admin', () => {
        it('when provided name is wrong', async () => {
            const conn = await DatabaseResolver.getConnection();
            await saveAndTestAdmin(conn, defaultAdmin);
            const promise = conn.findAdminByNameOrEmail(alternativeAdmin.name);
            await expect(promise).resolves.toBeUndefined();
            await expectPromiseNotToReject(promise);
        });

        it('when provided email is wrong', async () => {
            const conn = await DatabaseResolver.getConnection();
            await saveAndTestAdmin(conn, defaultAdmin);
            const promise = conn.findAdminByNameOrEmail(
                alternativeAdmin.user.email
            );
            await expect(promise).resolves.toBeUndefined();
            await expectPromiseNotToReject(promise);
        });
    });
});

describe('User-Token Database Tests', () => {
    beforeEach(() => DatabaseResolver.reset());

    it('should save a new user-token sucessfully', async () => {
        const tokenValue = 'randomToken153412';
        const expectedResult = { token: tokenValue };
        const conn = await DatabaseResolver.getConnection();
        const admin = await saveAndTestAdmin(conn, defaultAdmin);
        const promise = expectPromiseNotToReject(
            conn.saveNewUserToken(tokenValue, admin.id!)
        );
        const d = await promise;
        await expect(promise).resolves.toMatchObject(expectedResult);
    });

    it('should invalidate a user-token sucessfully', async () => {
        const tokenValue = 'randomToken153412';
        const expectedResult = {
            token: tokenValue,
            user: {
                email: defaultAdmin.user.email,
                password: defaultAdmin.user.password,
                role: UserRole.Adm,
            },
        };
        const conn = await DatabaseResolver.getConnection();
        const admin = await saveAndTestAdmin(conn, defaultAdmin);
        await expectPromiseNotToReject(
            conn.saveNewUserToken(tokenValue, admin.id!)
        );
        const promise = expectPromiseNotToReject(
            conn.invalidateUserToken(tokenValue)
        );
        await expect(promise).resolves.toMatchObject(expectedResult);
    });
});
