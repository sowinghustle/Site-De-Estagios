import { Request, Response } from "express";
import { randomUUID } from "crypto";
import {
    deleteUserFromUsersCollection,
    updateUsersCollection,
    User,
    UserCollection,
    users,
} from "./model";
import * as authService from "../auth/service";

type CreateUserDto = {
    username: string;
    email: string;
    password: string;
};

type UpdateUserDto = {
    username: string;
    email: string;
};

export function index(req: Request, res: Response) {
    return res.send(users);
}

export async function createUser(req: Request, res: Response) {
    const user: CreateUserDto = req.body;
    const token = randomUUID();
    const id = Date.now().toString();
    const createdUser: User = { ...user, token, id };

    await updateUsersCollection([...users, createdUser]);

    authService.saveUserToken(res, token);

    return res.send({ success: true, user: createdUser });
}

export function getUser(req: Request, res: Response) {
    const id = req.params.id;

    for (let user of users) {
        if (user.id.match(id)) {
            return res.send({
                success: true,
                user,
            });
        }
    }

    return res.send({
        success: true,
        user: null,
    });
}

export async function updatedUser(req: Request, res: Response) {
    const id = req.params.id;
    const updateUser: UpdateUserDto = req.body;
    const newUsers: UserCollection = [];

    let userFound: null | User = null;

    for (let user of users) {
        if (user.id.match(id)) {
            const newUser: User = {
                ...user,
                ...updateUser,
            };
            newUsers.push(newUser);
            userFound = newUser;
        } else {
            newUsers.push(user);
        }
    }

    await updateUsersCollection(newUsers);

    return res.send({
        success: userFound != null,
        user: userFound,
    });
}

export async function deleteUser(req: Request, res: Response) {
    const id = req.params.id;

    await deleteUserFromUsersCollection(id);

    return res.send({
        success: true,
    });
}
