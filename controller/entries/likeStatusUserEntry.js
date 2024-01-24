const sendQuery = require("../../db/connectToDB")

async function likeStatusUserEntry(req, res, next) {
  try {
    const { userId } = req.user
    const entryId = req.params.entryId
    let likeStatus = false

    const results = await sendQuery(`
    SELECT  * FROM likes WHERE user_id = ? AND new_id = ?
    `, [userId,entryId])
    
    if (!results || results.length === 0) {
        likeStatus = false    
    }
    else {
        likeStatus = true
    }

    res.send({
            ok: 'true',
            data: {
                results,
                likeStatus
            },
            error: null,
            message: `Estado ${likeStatus} del like de la noticia ${entryId}`
        });

  } catch (error) {
     next(error);
  }
}
module.exports = likeStatusUserEntry