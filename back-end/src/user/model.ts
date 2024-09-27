export enum UserRole {
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

export function mapUserToJson(user: User) {
    const data: Record<string, any> = { ...user, password: undefined };
    return JSON.parse(JSON.stringify(data));
}
