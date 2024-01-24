const Joi = require('joi');

const updateUserSchema = Joi.object({
    user_name: Joi.string().min(3).max(45).messages({
        'string.min': 'El nombre no puede tener menos de 5 caracteres',
        'string.max': 'El nombre no puede tener más de 45 caracteres'
    }),
    user_email: Joi.string().email().messages({
        'string.email': 'El email no es válido'

    }),

    user_password: Joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/).min(8).max(30).required().messages({
        'string.pattern.base': 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'

    })
});

module.exports = updateUserSchema;