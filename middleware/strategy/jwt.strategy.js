const { Strategy, ExtractJwt } = require('passport-jwt');

const JWT_STRATEGY = new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}, (payload, done) => {
    return done(null, payload);
})

module.exports = { JWT_STRATEGY };