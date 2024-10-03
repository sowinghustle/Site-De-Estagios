import { buildToResult, Result } from '../config/utils';
import { DatabaseResolver } from '../database';
import hashService from '../hash/service';
import userService from '../user/service';
import { Student } from './model';

export class StudentService {
    async findStudentByEmail(
        email: string
    ): Promise<Result<Student | undefined>> {
        const toResult = buildToResult<Student | undefined>();
        const conn = await DatabaseResolver.getConnection();
        const student = await conn.findStudentByEmail(email);
        return toResult(student);
    }

    async ensureCanSaveStudent(student: Student): Promise<Result<void>> {
        const toResult = buildToResult<void>();
        const verifyEmailResult = await userService.ensureEmailIsNotInUse(
            student.user.email
        );

        if (verifyEmailResult.isError) {
            return toResult(verifyEmailResult.value);
        }

        return toResult();
    }

    async saveNewStudent(student: Student): Promise<Result<Student>> {
        const toResult = buildToResult<Student>();
        const conn = await DatabaseResolver.getConnection();
        const encryptedPassword = await hashService.encryptPassword(
            student.user.password
        );
        const createdStudent = await conn.saveNewStudent({
            ...student,
            user: {
                ...student.user,
                password: encryptedPassword,
            },
        });
        const error = conn.getError();

        if (error) {
            return toResult(error);
        }

        return toResult(createdStudent!);
    }
}

const studentService = new StudentService();

export default studentService;
