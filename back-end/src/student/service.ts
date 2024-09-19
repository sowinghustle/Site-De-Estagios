import { buildToResult, Result } from '../config/utils';
import { DatabaseResolver } from '../database';
import hashService from '../hash/service';
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

    async saveNewStudent(student: Student) {
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
