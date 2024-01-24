const sendQuery = require("../../db/connectToDB");


async function getAllEntries(req, res, next) {
  try {
    // Obtenemos los posibles filtros de los query params.
    let { keyword } = req.query;

    // Si no hay filtro establecemos un string vacio.
    keyword = keyword || '';
  
    const results = await sendQuery(
      `
        SELECT * FROM news n
        INNER JOIN users u ON n.users_user_id = u.user_id
        WHERE n.new_title LIKE ? OR n.new_text LIKE ? OR u.user_name LIKE ?
        ORDER BY n.created_at DESC
      `
      , [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
    );

    res.send({
      ok: true,
      data: results,
      error: null,
      message: "Listado general de noticias solicitados correctamente"
    })
  } catch (error) {
    next(error)
  }

}

module.exports = getAllEntries