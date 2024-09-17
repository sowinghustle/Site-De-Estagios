export enum UserRole {
    Unknown = 'unknown',
    Adm = 'admin',
    Student = 'student',
    Supervisor = 'supervisor',
}

export const UserRoleValues = Object.values(UserRole);

export type User = {
    id?: number;
    email: string;
    password: string;
    role: UserRole;
};

export type AdmUser = Omit<User, 'role'>;
export type StudentUser = Omit<User, 'role'>;
export type SupervisorUser = Omit<User, 'role'>;

export type UserCollection = User[];
