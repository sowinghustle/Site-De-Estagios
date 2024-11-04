import testingUtils, {
    ALTERNATIVE_ADMIN,
    ALTERNATIVE_STUDENT,
    ALTERNATIVE_SUPERVISOR,
    DEFAULT_ADMIN,
    DEFAULT_ADMIN_WITHOUT_PASSWORD,
    DEFAULT_STUDENT,
    DEFAULT_SUPERVISOR,
    DEFAULT_SUPERVISOR_WITHOUT_PASSWORD,
} from '../modules/config/testing';
import { toResult } from '../modules/config/utils';
import { DatabaseResolver } from '../modules/database';
import adminService from '../services/admin';

describe('Admin Database Tests', () => {
    beforeEach(() => DatabaseResolver.reset());

    it('should save a new admin', async () => {
        const expectAdminValue = DEFAULT_ADMIN_WITHOUT_PASSWORD;
        const result = await testingUtils.saveAdmin(DEFAULT_ADMIN);
        expect(result.isError).toBe(false);
        expect(result.value).toMatchObject(expectAdminValue);
    });

    describe('should not save a new admin', () => {
        it('admin name already in use', async () => {
            await testingUtils.saveAndTestAdmin(DEFAULT_ADMIN);
            const result = await testingUtils.saveAdmin({
                ...DEFAULT_ADMIN,
                user: {
                    ...DEFAULT_ADMIN.user,
                    email: ALTERNATIVE_ADMIN.user.email,
                },
            });
            expect(result.value).toBeInstanceOf(Error);
        });

        it('specified email already in use', async () => {
            await testingUtils.saveAndTestAdmin(DEFAULT_ADMIN);
            const result = await testingUtils.saveAdmin({
                ...DEFAULT_ADMIN,
                name: ALTERNATIVE_ADMIN.name,
            });
            expect(result.value).toBeInstanceOf(Error);
        });
    });

    describe('should find admin', () => {
        it('by name field', async () => {
            const expectedResultValue = DEFAULT_ADMIN_WITHOUT_PASSWORD;
            await testingUtils.saveAndTestAdmin(DEFAULT_ADMIN);
            const result = await toResult(
                adminService.findAdminByNameOrEmail(DEFAULT_ADMIN.name)
            ).resolveAsync();
            expect(result.value).toMatchObject(expectedResultValue);
        });

        it('by email field', async () => {
            const expectedResultValue = DEFAULT_ADMIN_WITHOUT_PASSWORD;
            await testingUtils.saveAndTestAdmin(DEFAULT_ADMIN);
            const result = await toResult(
                adminService.findAdminByNameOrEmail(DEFAULT_ADMIN.user.email)
            ).resolveAsync();
            expect(result.value).toMatchObject(expectedResultValue);
        });
    });

    describe('should not find admin', () => {
        it('when provided name is wrong', async () => {
            await testingUtils.saveAndTestAdmin(DEFAULT_ADMIN);
            const result = await toResult(
                adminService.findAdminByNameOrEmail(ALTERNATIVE_ADMIN.name)
            ).resolveAsync();
            expect(result.value).toBeUndefined();
            expect(result.isError).toBe(false);
        });

        it('when provided email is wrong', async () => {
            await testingUtils.saveAndTestAdmin(DEFAULT_ADMIN);
            const result = await toResult(
                adminService.findAdminByNameOrEmail(
                    ALTERNATIVE_ADMIN.user.email
                )
            ).resolveAsync();
            expect(result.value).toBeUndefined();
            expect(result.isError).toBe(false);
        });
    });
});

describe('Supervisor Database Tests', () => {
    beforeEach(() => DatabaseResolver.reset());

    it('should save a new supervisor', async () => {
        const expectedSupervisorValue = {
            ...DEFAULT_SUPERVISOR,
            user: testingUtils.getUserWithoutPassword(DEFAULT_SUPERVISOR.user),
        };
        const result = await testingUtils.saveSupervisor(DEFAULT_SUPERVISOR);
        expect(result.value).toMatchObject(expectedSupervisorValue);
    });

    it('should not save a new supervisor with specified email already in use', async () => {
        await testingUtils.saveAndTestSupervisor(DEFAULT_SUPERVISOR);
        const result = await testingUtils.saveSupervisor({
            ...DEFAULT_SUPERVISOR,
            name: ALTERNATIVE_SUPERVISOR.name,
        });
        expect(result.value).toBeInstanceOf(Error);
    });

    it('should find supervisor by email field', async () => {
        const expectedResultValue = DEFAULT_SUPERVISOR_WITHOUT_PASSWORD;
        await testingUtils.saveAndTestSupervisor(DEFAULT_SUPERVISOR);
        const conn = await DatabaseResolver.getConnection();
        const promise = conn.findSupervisorByEmail(
            DEFAULT_SUPERVISOR.user.email
        );
        await testingUtils.expectPromiseNotToReject(promise);
        await expect(promise).resolves.toMatchObject(expectedResultValue);
    });

    it('should not find supervisor when provided email is wrong', async () => {
        await testingUtils.saveAndTestSupervisor(DEFAULT_SUPERVISOR);
        const conn = await DatabaseResolver.getConnection();
        const promise = conn.findAdminByNameOrEmail(
            ALTERNATIVE_SUPERVISOR.user.email
        );
        await expect(promise).resolves.toBeUndefined();
        await testingUtils.expectPromiseNotToReject(promise);
    });
});

describe('Student Database Tests', () => {
    beforeEach(() => DatabaseResolver.reset());

    it('should save a new student', async () => {
        const expectedStudentValue = {
            ...DEFAULT_STUDENT,
            user: await testingUtils.getUserWithoutPassword(
                DEFAULT_STUDENT.user
            ),
        };
        const result = await testingUtils.saveStudent(DEFAULT_STUDENT);
        expect(result.value).toMatchObject(expectedStudentValue);
    });

    it('should get user by id', async () => {
        const student = await testingUtils.saveAndTestStudent(DEFAULT_STUDENT);
        const conn = await DatabaseResolver.getConnection();

        expect(
            await testingUtils.expectPromiseNotToReject(
                conn.findUserById(student.id!)
            )
        ).not.toBeUndefined();

        expect(conn.getError()).toBeUndefined();
    });

    it('should not save a new student with specified email already in use', async () => {
        await testingUtils.saveAndTestStudent(DEFAULT_STUDENT);
        const result = await testingUtils.saveStudent({
            ...DEFAULT_STUDENT,
            fullName: ALTERNATIVE_STUDENT.fullName,
        });
        expect(result.value).toBeInstanceOf(Error);
    });

    it('should find student by email field', async () => {
        const expectedResultValue = {
            ...DEFAULT_STUDENT,
            user: testingUtils.getUserWithoutPassword(DEFAULT_STUDENT.user),
        };

        await testingUtils.saveAndTestStudent(DEFAULT_STUDENT);
        const conn = await DatabaseResolver.getConnection();
        const promise = conn.findStudentByEmail(DEFAULT_STUDENT.user.email);
        await testingUtils.expectPromiseNotToReject(promise);
        await expect(promise).resolves.toMatchObject(expectedResultValue);
    });

    it('should not find student when provided email is wrong', async () => {
        await testingUtils.saveAndTestStudent(DEFAULT_STUDENT);
        const conn = await DatabaseResolver.getConnection();
        const promise = conn.findStudentByEmail(ALTERNATIVE_STUDENT.user.email);
        await expect(promise).resolves.toBeUndefined();
        await testingUtils.expectPromiseNotToReject(promise);
    });
});

describe('Access-Token Database Tests', () => {
    beforeEach(() => DatabaseResolver.reset());

    it('should save a new access-token successfully', async () => {
        const expectedResult = { token: testingUtils.token };
        const admin = await testingUtils.saveAndTestAdmin(DEFAULT_ADMIN);
        const conn = await DatabaseResolver.getConnection();
        const promise = testingUtils.expectPromiseNotToReject(
            conn.saveNewAccessToken(testingUtils.token, admin.id!)
        );
        await expect(promise).resolves.toMatchObject(expectedResult);
    });

    it('should find a user by a valid access-token', async () => {
        const expectedResult = DEFAULT_ADMIN_WITHOUT_PASSWORD.user;
        const admin = await testingUtils.saveAndTestAdmin(DEFAULT_ADMIN);
        const conn = await DatabaseResolver.getConnection();
        await testingUtils.expectPromiseNotToReject(
            conn.saveNewAccessToken(testingUtils.token, admin.id!)
        );
        const promise = testingUtils.expectPromiseNotToReject(
            conn.findUserByValidAccessToken(testingUtils.token)
        );
        await expect(promise).resolves.toMatchObject(expectedResult);
    });

    it('should not find a user with an invalid access-token', async () => {
        const admin = await testingUtils.saveAndTestAdmin(DEFAULT_ADMIN);
        const conn = await DatabaseResolver.getConnection();
        await testingUtils.expectPromiseNotToReject(
            conn.saveNewAccessToken(testingUtils.token, admin.id!)
        );
        const promise = testingUtils.expectPromiseNotToReject(
            conn.findUserByValidAccessToken('invalid_access_token')
        );
        await expect(promise).resolves.toBeUndefined();
    });

    it('should invalidate a access-token successfully', async () => {
        const expectedResult = {
            token: testingUtils.token,
            user: await testingUtils.getUserWithoutPassword(DEFAULT_ADMIN.user),
        };
        const admin = await testingUtils.saveAndTestAdmin(DEFAULT_ADMIN);
        const conn = await DatabaseResolver.getConnection();
        await testingUtils.expectPromiseNotToReject(
            conn.saveNewAccessToken(testingUtils.token, admin.id!)
        );
        const promise = testingUtils.expectPromiseNotToReject(
            conn.invalidateAccessToken(testingUtils.token)
        );
        await expect(promise).resolves.toMatchObject(expectedResult);
    });
});

describe('Reset-Password Token Database Tests', () => {
    beforeEach(() => DatabaseResolver.reset());

    it('should save a new reset-password token successfully', async () => {
        const expectedResult = { token: testingUtils.token };
        const admin = await testingUtils.saveAndTestAdmin(DEFAULT_ADMIN);
        const conn = await DatabaseResolver.getConnection();
        const promise = testingUtils.expectPromiseNotToReject(
            conn.saveNewResetPasswordToken(admin.user.email, testingUtils.token)
        );
        await expect(promise).resolves.toMatchObject(expectedResult);
    });

    it('should find a reset-password token by valid token and email', async () => {
        const expectedResult = {
            email: DEFAULT_ADMIN.user.email,
            token: testingUtils.token,
        };
        const admin = await testingUtils.saveAndTestAdmin(DEFAULT_ADMIN);
        const conn = await DatabaseResolver.getConnection();
        await testingUtils.expectPromiseNotToReject(
            conn.saveNewResetPasswordToken(admin.user.email, testingUtils.token)
        );
        const promise = testingUtils.expectPromiseNotToReject(
            conn.findValidResetPasswordToken(
                admin.user.email,
                testingUtils.token
            )
        );
        await expect(promise).resolves.toMatchObject(expectedResult);
    });

    it('should not find a reset-password token with invalid email', async () => {
        const admin = await testingUtils.saveAndTestAdmin(DEFAULT_ADMIN);
        const conn = await DatabaseResolver.getConnection();
        await testingUtils.expectPromiseNotToReject(
            conn.saveNewResetPasswordToken(admin.user.email, testingUtils.token)
        );
        const promise = testingUtils.expectPromiseNotToReject(
            conn.findValidResetPasswordToken(
                ALTERNATIVE_ADMIN.user.email,
                testingUtils.token
            )
        );
        await expect(promise).resolves.toBeUndefined();
    });

    it('should not find a reset-password token with invalid token', async () => {
        const admin = await testingUtils.saveAndTestAdmin(DEFAULT_ADMIN);
        const conn = await DatabaseResolver.getConnection();
        await testingUtils.expectPromiseNotToReject(
            conn.saveNewResetPasswordToken(admin.user.email, testingUtils.token)
        );
        const promise = testingUtils.expectPromiseNotToReject(
            conn.findValidResetPasswordToken(
                admin.user.email,
                'invalid_reset_password_token'
            )
        );
        await expect(promise).resolves.toBeUndefined();
    });

    it('should invalidate a reset-password token successfully', async () => {
        const expectedResult = {
            token: testingUtils.token,
            email: DEFAULT_ADMIN.user.email,
        };
        const admin = await testingUtils.saveAndTestAdmin(DEFAULT_ADMIN);
        const conn = await DatabaseResolver.getConnection();
        await testingUtils.expectPromiseNotToReject(
            conn.saveNewResetPasswordToken(admin.user.email, testingUtils.token)
        );
        const promise = testingUtils.expectPromiseNotToReject(
            conn.invalidateResetPasswordToken(testingUtils.token)
        );
        await expect(promise).resolves.toMatchObject(expectedResult);
    });
});
