require('dotenv').config();


// Importamos la dependencia que encripta contraseñas y la dependencia que genera un token.
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Importamos la función que me permite interactuar con la base de datos.
const sendQuery = require('../../db/connectToDB');

// Importamos el esquema.
const loginUserSchema = require('../../schemas/usersSchemas/loginUserSchema');

// Importamos la función que valida un esquema.
const validateSchema = require('../../helpers/validateSchema');

// Importamos la función que genera errores.
const createError = require('../../helpers/createError');

async function loginUser(req, res, next) {
  try {
    // Validamos los datos que nos envía el usuario con Joi.
    await validateSchema(loginUserSchema, req.body);
 
    const { email, password } = req.body;

    const [user] = await sendQuery(
      'SELECT * FROM users WHERE user_email  = ?',
      [email]
    );

    if (!user) {
      createError(401, 'Email o Password son inválidos');
    }

    const validPassword = await bcrypt.compare(password, user.user_password);

    if (!validPassword) {
      createError(401, 'Email o Password son inválidos');
    }

    // Creamos un objeto con la info que queramos añadir al token.
    const infoUser = {
      userId: user.user_id,
      user_name: user.user_name,
    };

    const token = jwt.sign(infoUser, process.env.SECRET_KEY, {
      expiresIn: '1d',
    });

    res.send({
      ok: true,
      data: {
        token,
        username: user.user_name,
      },
      message: 'Login correcto',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = loginUser;
