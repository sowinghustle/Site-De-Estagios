import { CookieOptions } from 'express';
import projectConfig from '../config/project';

type CookieSetter = (token: string, options: CookieOptions) => void;

export class AuthService {
    async saveUserToken(token: string, setCookie: CookieSetter) {
        const options: CookieOptions = {
            maxAge: 1000 * 60 * 15,
            httpOnly: true,
            signed: false,
        };

        if (projectConfig.environment == 'production') {
            options.signed = true;
            options.secure = true;
        }

        setCookie(token, options);
    }
}

const authService = new AuthService();

export default authService;
