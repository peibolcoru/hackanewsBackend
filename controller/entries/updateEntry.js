require('dotenv').config();
const Joi = require('joi');
const path = require('path');
const sharp = require('sharp');

const createError = require('../../helpers/createError');
const sendQuery = require('../../db/connectToDB');
const createFolder = require('../../middlewares/createfolder');
const randomId = require('random-id');
const { log } = require('console');

async function updateEntry (req, res, next) {
    try {
        const { userId } = req.user; //saca la info del usuario
        const { entryId } = req.params;

        //* Comprobar si la entrada existe o no
        const [entry] = await sendQuery(
            `
            SELECT * 
            FROM news
            WHERE id = ?
        `,
            [entryId]
        );

        if (!entry) {
            createError(404, 'No existe ninguna noticia con ese ID.');
        }

        //* Comprobamos que seas el dueño de la entrada, y si no, ERROR
        if (entry.users_user_id !== userId) {
            createError(
                403,
                'No es tu noticia, no puedes editar la noticia de otra persona.'
            );
        }

        console.log(req.body);

        const schema = Joi.object({
            new_title: Joi.string(),
            new_entrance: Joi.string(),
            new_text: Joi.string(),
            new_pic: Joi.binary(),
            new_theme: Joi.number(),
        }).or('new_title', 'new_entrance', 'new_text', 'new_pic', 'new_theme');

        await schema.validateAsync(req.body);
        // RECOGIDA DE IMAGENES
        let imageFileName;

        if (req.files && req.files.new_pic) {
            // creacion path del directorio
            const uploadFolder = path.join(__dirname, '../../uploads');
            //creación del drectorio
            await createFolder(uploadFolder);
            // procesamos la imagen con sharp
            const image = sharp(req.files.new_pic.data);
            image.resize(320, 240);
            // guardamos la imagen en uploads
            imageFileName = `${randomId()}.jpg`;

            await image.toFile(path.join(uploadFolder, imageFileName));
        }

        let { new_title, new_entrance, new_text, new_theme } = req.body;

        new_title = new_title || entry.new_title;
        new_entrance = new_entrance || entry.new_entrance;
        new_text = new_text || entry.new_text;
        new_pic = imageFileName || entry.new_pic;
        new_theme = new_theme || entry.new_theme;

        await sendQuery(
            `UPDATE news SET new_title=?, new_entrance=?, new_text=?, new_pic=?, themes_themes_id=? WHERE id=?`,
            [new_title, new_entrance, new_text, new_pic, new_theme, entryId]
        );

        res.status(200).json({
            ok: true,
            data: null,
            error: null,
            message: '🚀Entrada editada correctamente🚀',
            //res.send({ status: 'ok', message: '🚀Entrada realizada correctamente🚀' });
        });
    } catch (err) {
        next(err);
    }
}

module.exports = updateEntry;
