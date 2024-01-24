const sendQuery = require('../../db/connectToDB');
const createError = require('../../helpers/createError');

async function getAllCategories (req, res, next) {
    try {
        const results = await sendQuery(`SELECT * FROM themes`);

        if (!results || results.length === 0) {
            return next(createError(400, 'No hay entradas para ese usuario'));
        }

        res.send({
            ok: true,
            data: results,
            error: null,
            message: `Listado de categorias`,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = getAllCategories;
