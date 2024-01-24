const sendQuery = require('../../db/connectToDB');
const createError = require('../../helpers/createError');

async function getMeEntries(req, res, next) {
  try {
    const user = await sendQuery(
      `SELECT * FROM users 
      WHERE user_id = ?`,
      [req.user.userId]
    );

    if (!user || user.length === 0) {
      return next(createError(400, 'No existe el usuario'));
    }

    const results = await sendQuery(
      `SELECT * FROM news 
      INNER JOIN users ON news.users_user_id = users.user_id
      WHERE news.users_user_id = ?`,
      [req.user.userId]
    );

    if (!results || results.length === 0) {
      return next(createError(400, 'No hay entradas para ese usuario'));
    }

    res.send({
      ok: true,
      data: results,
      error: null,
      message: `Listado noticias del usuario ${req.user.userId} logueado solicitados correctamente`,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = getMeEntries;
