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
    role?: UserRole;
};

export type UserCollection = User[];
