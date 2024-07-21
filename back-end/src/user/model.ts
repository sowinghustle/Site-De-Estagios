export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    token: string;
}

export type UserCollection = User[];
export var users: UserCollection = [];

export async function updateUsersCollection(newUserList: UserCollection) {
    users = newUserList;
    return Promise.resolve();
}

export async function deleteUserFromUsersCollection(id: string) {
    return await updateUsersCollection(users.filter((u) => !u.id.match(id)));
}
