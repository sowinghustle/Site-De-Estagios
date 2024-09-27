declare namespace Express {
    interface Request {
        token?: string;
        user: number;
    }
}
