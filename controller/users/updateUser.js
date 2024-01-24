require('dotenv').config()

const createError = require('../../helpers/createError')
const sendQuery = require('../../db/connectToDB')
const bcrypt = require('bcrypt');
const updateUserSchema = require('../../schemas/usersSchemas/updateUserSchema');

async function updateUser(req, res, next) {
    try {
        const { userId } = req.user; // Obtiene la información del usuario

        const { error } = updateUserSchema.validate(req.body);

        if (error) {
            return next(createError(400, error.message));
        }

        const { user_email, user_password } = req.body;

        // Comprueba si el correo electrónico ya existe, excluyendo el usuario actual
        const [existingUser] = await sendQuery('SELECT * FROM users WHERE user_email = ? AND user_id != ?', [user_email, userId]);

        if (existingUser) {
            return next(createError(409, 'El correo electrónico ya está en uso por otro usuario.'));
        }

        // Si se cambia la nueva contraseña, se hashea
        let hashedPassword = await bcrypt.hash(user_password, 10);

        // Aqui se hacen los cambios
        await sendQuery('UPDATE users SET user_email=?, user_password=? WHERE user_id=?', [user_email, hashedPassword, userId]);

        res.status(200).json({
            ok: true,
            data: null,
            error: null,
            message: '🚀Perfil actualizado correctamente🚀'
        });
    } catch (error) {
        return next(error);
    }
}

module.exports = updateUser;



