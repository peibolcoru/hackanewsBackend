// Importamos el módulo que encripta contraseñas.
const bcrypt = require('bcrypt');

// Importamos la función que me permite interactuar con la base de datos.
const sendQuery = require('../../db/connectToDB');

// Importamos el esquema.
const newUserSchema = require('../../schemas/usersSchemas/newUserSchema');

// Importamos la función que valida un esquema.
const validateSchema = require('../../helpers/validateSchema');

// Importamos la función que genera errores.
const createError = require('../../helpers/createError');

async function addUser(req, res, next) {  // funcion que manda los datos a la base de datos
    try {
        // Validamos los datos que nos envía el usuario con Joi.
        await validateSchema(newUserSchema, req.body)
    
        const { user_name, user_email, user_password } = req.body
    
        const [username] = await sendQuery('SELECT user_name FROM users WHERE user_name = ?', [user_name]);

        if (username) {
            createError(409, 'El nombre de usuario ya existe')
        }

        const [useremail] = await sendQuery('SELECT user_email FROM users WHERE user_email = ?', [user_email]);

        if (useremail) {
            createError(409, "El email ya existe")
        }

        const hashedPassword = await bcrypt.hash(user_password, 10);

        const result = await sendQuery('INSERT INTO users (user_name, user_email, user_password) VALUES (?, ?, ?)', [user_name, user_email, hashedPassword]);

        res.send({
            userid: result.insertId,
            user_name,
            user_email,
            message: 'Registro correcto',
        });
    } catch (err) {
        next(err)
    }
}

module.exports = addUser
