const Passport = require('passport');
const { JWT_STRATEGY } = require('./strategy/jwt.strategy');

/** PENDIENTE: PROBAR Y AGREGAR GITHUB STRATEGY */
/** PENDIENTE: PROBAR Y AGREGAR TWITCH STRATEGY */
Passport.use(JWT_STRATEGY);