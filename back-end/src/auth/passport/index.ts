import passport from "passport";
import configurePassport from "./http-bearer-auth";

export function authenticate() {
    return passport.authenticate("bearer", { session: false });
}

export { configurePassport };
