export enum UserRole {
    Adm = 'admin',
    Student = 'student',
}

export type User = {
    id?: number;
    email: string;
    password: string;
    role: UserRole;
};

export type UserCollection = User[];

export type AdmUser = Omit<User, 'role'>;
export type StudentUser = Omit<User, 'role'>;

export const UserRoleValues = Object.values(UserRole);
