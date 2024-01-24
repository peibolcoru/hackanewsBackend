const sendQuery = require('../../db/connectToDB');

const createError = require('../../helpers/createError.js');

async function viewEntryById(req, res, next) {
    try {
        const newId = req.params.news_id;


        const results = await sendQuery(`
            SELECT *
            FROM news
            WHERE id = ?
        `, [newId]);

        if (!results || results.length === 0) {
            return next(createError(404, 'No hay entradas'));
        }

        const user = await sendQuery(`SELECT user_name, user_email FROM users WHERE user_id = ?`, [results[0].users_user_id]);
        if (!user || user.length === 0) {
            return next(createError(404, 'El usuario no existe'));
        }

        res.send({
            ok: 'true',
            data: {
                results,
                user
            },
            error: null,
            message: `Visualización de la entrada numero ${newId}`
        });


    } catch (error) {
        next(error);
    }
};


module.exports = viewEntryById;
