import { Request, Response } from "express";

export function index(req: Request, res: Response) {
    return res.send({
        user: req.user,
    });
}
