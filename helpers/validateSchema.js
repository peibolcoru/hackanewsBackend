async function validateSchema (schema, data) {
    try {
        await schema.validateAsync(data);
    } catch (err) {
        err.statusCode = 400;
        throw err;
    }
}

module.exports = validateSchema;