import passport from 'passport';
import { Strategy as CookieStrategy } from 'passport-custom';
import authService from '../../service';

export default function () {
    passport.use(
        'cookie',
        new CookieStrategy(async (req, done) => {
            try {
                req.token = req.cookies?.token;
                if (!req.token) return done(null, false);
                const user = (
                    await authService.findUserByValidAccessToken(req.token)
                ).orElseThrow();
                return done(null, user ?? false);
            } catch (err) {
                return done(err, false);
            }
        })
    );
}
