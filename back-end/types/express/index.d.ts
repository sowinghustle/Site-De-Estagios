import { User } from '../../src/user/model';

declare module 'express-serve-static-core' {
    interface Request {
        token?: string;
        user?: User;
    }
}
