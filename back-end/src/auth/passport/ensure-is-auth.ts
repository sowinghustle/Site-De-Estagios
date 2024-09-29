import passport from 'passport';

const ensureIsAuthenticated = passport.authenticate(['bearer', 'cookie'], {
    session: false,
});

export default ensureIsAuthenticated;
