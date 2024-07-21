import passport from "passport";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import { users } from "../../user/model";

export default function () {
    passport.use(
        "bearer",
        new BearerStrategy(function (token, done) {
            for (let user of users) {
                if (user.token.match(token)) {
                    return done(null, user, { scope: "all" });
                }
            }
            return done(null, false);
        })
    );
}
