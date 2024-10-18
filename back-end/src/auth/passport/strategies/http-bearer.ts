import passport from 'passport';
import {
    Strategy as BearerStrategy,
    VerifyFunctionWithRequest,
} from 'passport-http-bearer';
import authService from '../../service';

export default function () {
    passport.use(
        'bearer',
        new BearerStrategy<VerifyFunctionWithRequest>(
            {
                passReqToCallback: true,
            },
            async function (req, token, done) {
                req.token = token;

                try {
                    const user = (
                        await authService.findUserByValidUserToken(token)
                    ).orElseThrow();
                    return done(null, user ?? false);
                } catch (err) {
                    return done(err, false);
                }
            }
        )
    );
}
