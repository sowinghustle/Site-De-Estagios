import { User } from '../../src/user/model';

declare module 'express-serve-static-core' {
    interface Request {
        user?: User;
        token?: string;
    }
}
