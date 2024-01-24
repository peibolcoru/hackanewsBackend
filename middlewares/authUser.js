const createError = require('../helpers/createError');
const jwt = require('jsonwebtoken');


async function authUser(req, res, next) {
    try {
        const { 'authorization': token } = req.headers;

        if (!token) {
           createError(401, 'No autenticado');
        }

        let infoUser;

        try {
            infoUser = jwt.verify(token, process.env.SECRET_KEY);

            req.user = infoUser;
        
            next();
        } catch (err) {
            console.error(err);
            
            createError(401, 'Token incorrecto');
        }
       
    } catch (err) {
        next(err)
    }
}


module.exports = authUser;