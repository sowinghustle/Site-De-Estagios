import { CookieOptions, Response } from 'express';
import projectConfig from '../config/project';

export function saveUserToken(res: Response, token: string) {
    const options: CookieOptions = {
        maxAge: 1000 * 60 * 15,
        httpOnly: true,
        signed: false,
    };

    if (projectConfig.environment == 'production') {
        options.signed = true;
        options.secure = true;
    }

    res.cookie('token', token, options);
}
