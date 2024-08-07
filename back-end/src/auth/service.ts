import { CookieOptions } from 'express';
import projectConfig from '../config/project';
import { User } from '../user/model';

type CookieSetter = (token: string, options: CookieOptions) => void;

export class AuthService {
    saveUserToken(user: User, setCookieAsync: CookieSetter) {
        const options: CookieOptions = {
            maxAge: 1000 * 60 * 15,
            httpOnly: true,
            signed: false,
        };

        if (projectConfig.environment == 'production') {
            options.signed = true;
            options.secure = true;
        }

        setCookieAsync(user.token, options);
    }
}

const authService = new AuthService();

export default authService;
