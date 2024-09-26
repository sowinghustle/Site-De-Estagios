import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { DatabaseResolver } from '../../database';

export default function () {
    passport.use(
        'bearer',
        new BearerStrategy(async function (token: string | undefined, done) {
            try {
                if (!token) {
                    return done('O token de acesso não foi recebido', false);
                }
                const conn = await DatabaseResolver.getConnection();
                const user = await conn.findUserByValidUserToken(token);
                if (user) return done(null, user, { scope: 'all' });
                return done(conn.getError(), false);
            } catch (err) {
                return done(err, false);
            }
        })
    );
}
