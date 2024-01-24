const sendQuery = require('../../db/connectToDB');
const createError = require('../../helpers/createError');

async function getMeUSer(req, res, next) {
  try {
    const users = await sendQuery('SELECT * FROM users WHERE user_id = ?', [
      req.user.userId,
    ]);

    res.send({
      ok: true,
      data: {
        user: users[0],
      },
      error: null,
      message: 'Estos son los datos del usurio logueado',
    });
  } catch (error) {
    createError(400, 'Ha coucrrido un error en la consulta');
  }
}

module.exports = getMeUSer;
