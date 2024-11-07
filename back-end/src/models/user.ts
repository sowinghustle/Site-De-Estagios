import { UserRole } from './user-role';

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
