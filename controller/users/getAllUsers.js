const sendQuery = require("../../db/connectToDB");

async function getAllUsers(req, res, next) {
    try {
        const results = await sendQuery('SELECT user_name, user_email FROM users');
        res.send({
            ok: true
            , data: results,
            error: null,
            message: "Listado general de usuarios solicitados correctamente"
        })
    } catch (error) {
        next(error)
    }

}

module.exports = getAllUsers