const Joi = require("joi")
const createError = require("../../helpers/createError")
const sendQuery = require("../../db/connectToDB")

async function deleteUser(req, res, next) {
  
  // Id de usuario del token
  const { userId } = req.user
  console.log(`Id del token : ${userId}`)
  
  // VAlidación del joi
  const schema = Joi.number().positive().integer()
  const userDeleteID = req.params.userDeleteId
  try {
    await schema.validateAsync(userDeleteID)

  } catch (error) {
    return next(createError(400,"La id no es la correcta"))
  }
  // Comprobación de si el usuario existe en la BD
  try {
    const [result] = await sendQuery(
      `SELECT * FROM users 
      WHERE user_id=?`,
      [userDeleteID]
    )
    console.log(`Id del param : ${[userDeleteID]}`)
    if (!result) {
      return next(createError(404,"El usuario no existe en la BD"))
    }
    // Comprobamos que el propio usuario se pueda eliminar

    if (userDeleteID != userId) {
      return next(createError(403, "No tiene permisos para borrar el usuario"))
    }
    await sendQuery(`DELETE FROM users WHERE user_id=?`, [userDeleteID])
  }
  catch (error) {

  }
  res.send({
    ok: true,
    data: null,
    error: null,
    message: "El usuario ha sido borrado correctamente"
  })
}
module.exports = deleteUser
