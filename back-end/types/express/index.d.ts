import { User } from '../../src/models/user';

declare module 'express-serve-static-core' {
    interface Request {
        user?: User;
        token?: string;
    }
}
