const Joi = require('joi');

const loginUserSchema = Joi.object({

email: Joi.string().email().required().messages({
        'string.email': 'El email no es válido',
        'any.required': 'El email es requerido'
    }),

password: Joi.string().required().messages({
        'any.required': 'La contraseña es requerida'
    })
});

module.exports = loginUserSchema;