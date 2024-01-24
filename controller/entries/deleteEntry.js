const Joi = require('joi')
const createError = require('../../helpers/createError')
const sendQuery = require('../../db/connectToDB')

async function deleteEntry (req, res, next) {
  //* Cogemos los datos del user
  const { userId } = req.user

  //* Validamos el id que me pases sea correcto
  const schema = Joi.number().positive().integer()
  try {
    await schema.validateAsync(req.params.entryId)
  } catch (error) {
    return next(createError(400, error.message))
  }
  const { entryId } = req.params

  try {
    //* Comprobar si la entrada existe o no
    const [entry] = await sendQuery(
      `
            SELECT * 
            FROM news
            WHERE id = ?
        `,
      [entryId]
    )
    console.log(entry)
    if (!entry) {
      return next(createError(404, 'No existe ninguna noticia con ese ID.'))
    }

    //* Comprobamos que seas el dueño de la entrada, y si no, ERROR
    if (entry.users_user_id !== userId) {
      return next(
        createError(
          403,
          'No es tu noticia, no puedes borrar la noticia de otra persona.'
        )
      )
    }

    //* Faltaría borrar la entrada
    await sendQuery(
      `
            DELETE FROM news
            WHERE id = ?
        `,
      [entryId]
    )
  } catch (error) {
    return next(error)
  }

  res.send({
    ok: true,
    data: null,
    error: null,
    message: 'Noticia borrada correctamente.'
  })
}

module.exports = deleteEntry
