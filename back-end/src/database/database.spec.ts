import { DatabaseResolver } from '.';
import adminService from '../admin/service';
import { TestingUtils, token } from '../config/testing';

describe('Admin Database Tests', () => {
    beforeEach(() => DatabaseResolver.reset());

    it('should save a new admin', async () => {
        const expectAdminValue = TestingUtils.DEFAULT_ADMIN_WITHOUT_PASSWORD;
        const result = await TestingUtils.saveAdmin(TestingUtils.DEFAULT_ADMIN);
        expect(result.isError).toBe(false);
        expect(result.value).toMatchObject(expectAdminValue);
    });

    describe('should not save a new admin', () => {
        it('admin name already in use', async () => {
            await TestingUtils.saveAndTestAdmin(TestingUtils.DEFAULT_ADMIN);
            const result = await TestingUtils.saveAdmin({
                ...TestingUtils.DEFAULT_ADMIN,
                user: {
                    ...TestingUtils.DEFAULT_ADMIN.user,
                    email: TestingUtils.ALTERNATIVE_ADMIN.user.email,
                },
            });
            expect(result.value).toBeInstanceOf(Error);
        });

        it('specified email already in use', async () => {
            await TestingUtils.saveAndTestAdmin(TestingUtils.DEFAULT_ADMIN);
            const result = await TestingUtils.saveAdmin({
                ...TestingUtils.DEFAULT_ADMIN,
                name: TestingUtils.ALTERNATIVE_ADMIN.name,
            });
            expect(result.value).toBeInstanceOf(Error);
        });
    });

    describe('should find admin', () => {
        it('by name field', async () => {
            const expectedResultValue =
                TestingUtils.DEFAULT_ADMIN_WITHOUT_PASSWORD;
            await TestingUtils.saveAndTestAdmin(TestingUtils.DEFAULT_ADMIN);
            const result = await adminService.findAdminByNameOrEmail(
                TestingUtils.DEFAULT_ADMIN.name
            );
            expect(result.value).toMatchObject(expectedResultValue);
        });

        it('by email field', async () => {
            const expectedResultValue =
                TestingUtils.DEFAULT_ADMIN_WITHOUT_PASSWORD;
            await TestingUtils.saveAndTestAdmin(TestingUtils.DEFAULT_ADMIN);
            const result = await adminService.findAdminByNameOrEmail(
                TestingUtils.DEFAULT_ADMIN.user.email
            );
            expect(result.value).toMatchObject(expectedResultValue);
        });
    });

    describe('should not find admin', () => {
        it('when provided name is wrong', async () => {
            await TestingUtils.saveAndTestAdmin(TestingUtils.DEFAULT_ADMIN);
            const result = await adminService.findAdminByNameOrEmail(
                TestingUtils.ALTERNATIVE_ADMIN.name
            );
            expect(result.value).toBeUndefined();
            expect(result.isError).toBe(false);
        });

        it('when provided email is wrong', async () => {
            await TestingUtils.saveAndTestAdmin(TestingUtils.DEFAULT_ADMIN);
            const result = await adminService.findAdminByNameOrEmail(
                TestingUtils.ALTERNATIVE_ADMIN.user.email
            );
            expect(result.value).toBeUndefined();
            expect(result.isError).toBe(false);
        });
    });
});

describe('Supervisor Database Tests', () => {
    beforeEach(() => DatabaseResolver.reset());

    it('should save a new supervisor', async () => {
        const expectedSupervisorValue = TestingUtils.DEFAULT_SUPERVISOR;

        const result = await TestingUtils.saveSupervisor(
            TestingUtils.DEFAULT_SUPERVISOR
        );
        expect(result.value).toMatchObject(expectedSupervisorValue);
    });

    it('should not save a new supervisor with specified email already in use', async () => {
        await TestingUtils.saveAndTestSupervisor(
            TestingUtils.DEFAULT_SUPERVISOR
        );
        const result = await TestingUtils.saveSupervisor({
            ...TestingUtils.DEFAULT_SUPERVISOR,
            name: TestingUtils.ALTERNATIVE_SUPERVISOR.name,
        });
        expect(result.value).toBeInstanceOf(Error);
    });

    it('should find supervisor by email field', async () => {
        const expectedResultValue = TestingUtils.DEFAULT_SUPERVISOR;
        await TestingUtils.saveAndTestSupervisor(
            TestingUtils.DEFAULT_SUPERVISOR
        );
        const conn = await DatabaseResolver.getConnection();
        const promise = conn.findSupervisorByEmail(
            TestingUtils.DEFAULT_SUPERVISOR.user.email
        );
        await TestingUtils.expectPromiseNotToReject(promise);
        await expect(promise).resolves.toMatchObject(expectedResultValue);
    });

    it('should not find supervisor when provided email is wrong', async () => {
        await TestingUtils.saveAndTestSupervisor(
            TestingUtils.DEFAULT_SUPERVISOR
        );
        const conn = await DatabaseResolver.getConnection();
        const promise = conn.findAdminByNameOrEmail(
            TestingUtils.ALTERNATIVE_SUPERVISOR.user.email
        );
        await expect(promise).resolves.toBeUndefined();
        await TestingUtils.expectPromiseNotToReject(promise);
    });
});

describe('Student Database Tests', () => {
    beforeEach(() => DatabaseResolver.reset());

    it('should save a new student', async () => {
        const expectedStudentValue = {
            ...TestingUtils.DEFAULT_STUDENT,
            user: await TestingUtils.getUserWithoutPassword(
                TestingUtils.DEFAULT_STUDENT.user
            ),
        };
        const result = await TestingUtils.saveStudent(
            TestingUtils.DEFAULT_STUDENT
        );
        expect(result.value).toMatchObject(expectedStudentValue);
    });

    it('should get user by id', async () => {
        const student = await TestingUtils.saveAndTestStudent(
            TestingUtils.DEFAULT_STUDENT
        );
        const conn = await DatabaseResolver.getConnection();

        expect(
            await TestingUtils.expectPromiseNotToReject(
                conn.findUserById(student.id!)
            )
        ).not.toBeUndefined();

        expect(conn.getError()).toBeUndefined();
    });

    it('should not save a new student with specified email already in use', async () => {
        await TestingUtils.saveAndTestStudent(TestingUtils.DEFAULT_STUDENT);
        const result = await TestingUtils.saveStudent({
            ...TestingUtils.DEFAULT_STUDENT,
            fullName: TestingUtils.ALTERNATIVE_STUDENT.fullName,
        });
        expect(result.value).toBeInstanceOf(Error);
    });

    it('should find student by email field', async () => {
        const expectedResultValue = {
            ...TestingUtils.DEFAULT_STUDENT,
            user: await TestingUtils.getUserWithoutPassword(
                TestingUtils.DEFAULT_STUDENT.user
            ),
        };

        await TestingUtils.saveAndTestStudent(TestingUtils.DEFAULT_STUDENT);
        const conn = await DatabaseResolver.getConnection();
        const promise = conn.findStudentByEmail(
            TestingUtils.DEFAULT_STUDENT.user.email
        );
        await TestingUtils.expectPromiseNotToReject(promise);
        await expect(promise).resolves.toMatchObject(expectedResultValue);
    });

    it('should not find student when provided email is wrong', async () => {
        await TestingUtils.saveAndTestStudent(TestingUtils.DEFAULT_STUDENT);
        const conn = await DatabaseResolver.getConnection();
        const promise = conn.findStudentByEmail(
            TestingUtils.ALTERNATIVE_STUDENT.user.email
        );
        await expect(promise).resolves.toBeUndefined();
        await TestingUtils.expectPromiseNotToReject(promise);
    });
});

describe('User-Token Database Tests', () => {
    beforeEach(() => DatabaseResolver.reset());

    it('should save a new user-token successfully', async () => {
        const expectedResult = { token };
        const admin = await TestingUtils.saveAndTestAdmin(
            TestingUtils.DEFAULT_ADMIN
        );
        const conn = await DatabaseResolver.getConnection();
        const promise = TestingUtils.expectPromiseNotToReject(
            conn.saveNewUserToken(token, admin.id!)
        );
        await expect(promise).resolves.toMatchObject(expectedResult);
    });

    it('should invalidate a user-token successfully', async () => {
        const expectedResult = {
            token,
            user: await TestingUtils.getUserWithoutPassword(
                TestingUtils.DEFAULT_ADMIN.user
            ),
        };
        const admin = await TestingUtils.saveAndTestAdmin(
            TestingUtils.DEFAULT_ADMIN
        );
        const conn = await DatabaseResolver.getConnection();
        await TestingUtils.expectPromiseNotToReject(
            conn.saveNewUserToken(token, admin.id!)
        );
        const promise = TestingUtils.expectPromiseNotToReject(
            conn.invalidateUserToken(token)
        );
        await expect(promise).resolves.toMatchObject(expectedResult);
    });
});
