const sendQuery = require('../../db/connectToDB');
const createError = require('../../helpers/createError');

async function byThemeEntry (req, res, next) {
    try {
        console.log(req.params);
        idThemeEntry = req.params.themeId;

        const entry = await sendQuery(
            `
    SELECT * FROM news 
    WHERE themes_themes_id = ?`,
            [idThemeEntry]
        );
        // if (entry.length === 0) {
        //   return next(createError(404, 'No existe ninguna entrada con ese tema.'))
        // }
        const theme = await sendQuery(
            `
    SELECT theme_name 
    FROM themes
    WHERE themes_id = ?`,
            [idThemeEntry]
        );
        const theme_name = theme[0].theme_name;
        res.send({
            ok: true,
            data: { theme_name, entry },
            error: null,
            message: `Entradas del tema : ${theme_name}`,
        });
    } catch (error) {
        next(error.message);
    }
}
module.exports = byThemeEntry;
