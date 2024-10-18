import { Admin, AdminCollection } from '../admin/model';
import { Student } from '../student/model';
import { Supervisor } from '../supervisor/model';
import { UserToken } from '../token/model';
import { User } from '../user/model';
import { SequelizeDatabaseConnection } from './sequelize';

export interface DatabaseConnection {
    getError(): Error | undefined;

    // cadastrar novo admin
    saveNewAdmin(admin: Admin): Promise<Admin | undefined>;

    // cadastrar novo orientador
    saveNewSupervisor(supervisor: Supervisor): Promise<Supervisor | undefined>;

    // cadastrar novo aluno
    saveNewStudent(student: Student): Promise<Student | undefined>;

    // cadastrar um novo user-token
    saveNewUserToken(
        token: string,
        userid: number
    ): Promise<UserToken | undefined>;

    // obter todos os admins
    getAdmins(): Promise<AdminCollection>;

    // obter um usuário pelo id
    findUserById(id: number): Promise<User | undefined>;

    // obter um usuário por um user-token válido
    findUserByValidUserToken(token: string): Promise<User | undefined>;

    // obter um administrador pelo nome ou email
    findAdminByNameOrEmail(nameOrEmail: string): Promise<Admin | undefined>;

    // obter um orientador pelo email
    findSupervisorByEmail(email: string): Promise<Supervisor | undefined>;

    // obter um estudente pelo email
    findStudentByEmail(email: string): Promise<Student | undefined>;

    // invalidar um user-token
    invalidateUserToken(token: string): Promise<UserToken | undefined>;
}

export class DatabaseResolver {
    private static initialized = false;

    public static async reset() {
        this.initialized = false;
    }

    public static async getConnection(): Promise<DatabaseConnection> {
        try {
            const conn = new SequelizeDatabaseConnection();

            if (!this.initialized) {
                await conn.init();
                this.initialized = true;
            }

            return conn;
        } catch (err) {
            const customError = err as Error;
            const message =
                'Unable to connect to database: ' + customError.message;
            customError.message = message;
            throw customError;
        }
    }
}
