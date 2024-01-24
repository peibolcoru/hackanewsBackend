const express = require('express')
const app = express()
const PORT = 3000

const usersRouter = require('./routes/usersRouter.js')
const entriesRouter = require('./routes/entriesRouter.js')
const errorHandler = require('./middlewares/errorHandler.js')

const morgan = require('morgan')
const fileUpload = require('express-fileupload')
const cors = require('cors')

app.use(morgan('dev'))
app.use(
  cors({
    origin: 'http://localhost:5173'
  })
)

app.use(express.static('uploads'))

app.use(express.json())
app.use(fileUpload())

app.use('/users', usersRouter)
app.use('/entries', entriesRouter)

// Middleware Error 404: not found
app.use((req, res) => {
  res.status(404).send({
    ok: false,
    data: null,
    error: null,
    message: '404: not found'
  })
})

// Middleware de error.
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
})
