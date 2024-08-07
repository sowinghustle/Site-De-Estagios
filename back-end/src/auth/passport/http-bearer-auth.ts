import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { DatabaseResolver } from '../../database';

export default function () {
    passport.use(
        'bearer',
        new BearerStrategy(async function (token, done) {
            try {
                const db = await DatabaseResolver.getDatabase();
                const users = await db.getUsers();

                for (let user of users) {
                    if (user.token?.match(token))
                        return done(null, user, { scope: 'all' });
                }

                return done(null, false);
            } catch (err) {
                return done(err, false);
            }
        })
    );
}
