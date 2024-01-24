require('dotenv').config();

const Joi = require('joi');
const path = require('path');
const sharp = require('sharp');

const createError = require('../../helpers/createError');
const sendQuery = require('../../db/connectToDB');
const createFolder = require('../../middlewares/createfolder');
const randomId = require('random-id');

async function addEntry (req, res, next) {
    const { userId } = req.user; //saca la info del usuario
    const schema = Joi.object({
        new_title: Joi.string().required(),
        new_entrance: Joi.string().required(),
        new_text: Joi.string(),
        new_pic: Joi.binary(),
        new_theme: Joi.number(),
    });

    try {
        await schema.validateAsync(req.body);
    } catch (error) {
        return next(createError(400, error.message));
    }

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

    //RECOGIDA DEL RESTO DE DATOS
    console.log(req.body);

    const { new_title, new_entrance, new_text, new_video, new_theme } =
        req.body;
    try {
        await sendQuery(
            `INSERT INTO news 
            (new_title, new_entrance, new_text, new_pic, new_video, users_user_id,  themes_themes_id) 
            VALUES (?, ?, ?, ?, ? , ?, ?);`,
            [
                new_title,
                new_entrance,
                new_text,
                imageFileName || 'imageNotFound.jpg',
                new_video,
                userId,
                new_theme,
            ]
        );

        res.status(200).json({
            ok: true,
            data: null,
            error: null,
            message: '🚀Entrada realizada correctamente🚀',
            //res.send({ status: 'ok', message: '🚀Entrada realizada correctamente🚀' });
        });
    } catch (error) {
        return next(error);
    }
}

module.exports = addEntry;
