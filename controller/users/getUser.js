const sendQuery = require('../../db/connectToDB');
const createError = require('../../helpers/createError');



async function getUser(req, res, next) {


    const userViewID = req.params.userId
    const { userId } = req.user

    if (userViewID != userId) {
        return next(createError(403, "No tiene permisos para ver el usuario"))
    }

    try {
        const [user] = await sendQuery(`
        SELECT user_id, user_name, user_email, user_avatar, created_at, modified_at, biography
        FROM users
        WHERE user_id = ?
    `, [userId]);
        if (!user) {
            return next(createError(404, "El usuario no esta en la Base de Datos"));
        }

        res.send({
            ok: true,
            data: user,
            error: null,
            message: "Usuario encontrado"
        });

    } catch (error) {
        next(error);
    }

}

module.exports = getUser;