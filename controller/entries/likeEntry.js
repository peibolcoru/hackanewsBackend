const sendQuery = require("../../db/connectToDB")
const createError = require("../../helpers/createError")

async function likeEntry(req, res, next) {
  try {
    const { userId } = req.user
    const entryId = req.params.entryId

    // Comprobamos si el usuario ya dio like a la noticia
    const result = await sendQuery(
      `
    SELECT * FROM likes
    WHERE new_id = ? AND user_id = ? `,
      [entryId, userId]
    )

    if (!result[0]) {
      const { insertId } = await sendQuery(
        `
      INSERT INTO likes(new_id,user_id)
      VALUES(?,?)`,
        [entryId, userId]
      )

      await sendQuery(
        `
      UPDATE news
      SET new_likes = new_likes + 1
      WHERE id = ?
       `,
        [entryId]
      )
      res.send({
        ok: true,
        data: true,
        error: false,
        message: "like añadido",
      })
    } else {
      await sendQuery(
        `
      DELETE FROM likes
      WHERE new_id = ? AND user_id = ? `,
        [entryId, userId]
      )

      await sendQuery(
        `
      UPDATE news
      SET new_likes = new_likes - 1
      WHERE id = ?
       `,
        [entryId]
      )
       res.send({
         ok: true,
         data: false,
         error: false,
         message: "like borrado",
       })
    }
  } catch (error) {
    next(createError(404,"No se ha podido realizar like"))
  }
}
module.exports = likeEntry
