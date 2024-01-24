const sendQuery = require("../../db/connectToDB")
const createError = require("../../helpers/createError")

async function viewLikeEntry(req, res, next) {
    try {

        const entryId = req.params.entryId
        const results = await sendQuery(
            `SELECT new_likes 
            FROM news
            WHERE id = ?  `,
            [entryId]
        )
        //console.log(results);
        res.send({
            ok: true,
            data: results,
            error: false,
            message: "likes obtenidos",
        })

    } catch (error) {
        next(createError(404, "Likes no encontrados"))

    }
}

module.exports = viewLikeEntry