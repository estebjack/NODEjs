require('dotenv').config() // toma los valores del .env url mongo
const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('dist'))
const cors = require('cors')
app.use(cors())
// app.use(logger) 

const Note = require('./models/note')
const { default: mongoose } = require('mongoose')





//CARGAR TODO
app.get('/api/notes',(request,response) =>{
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

//CARGAR 1 REGISDTRO
app.get('/api/notes/:id', (request, response, next ) =>{
  Note.findById(request.params.id)
    .then(note =>{
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


//AGREGAR
app.post('/api/notes',(request, response, next) => {
  const body= request.body
  if (body.content === undefined) {
    return response.status(400).json({error: 'contenido VACIO'})
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
  .catch(error => next(error))
})



//ELIMINAR
app.delete('/api/notes/:id', (request,response,next) => {
  Note.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})



//EDITAR
app.put('/api/notes/:id', (request, response, next) => {
  const {content, important} = request.body

  // const note = {
  //   content: body.content,
  //   important: body.important,
  // }

  Note.findByIdAndUpdate(
    request.params.id,
    {content, important},
    { new: true, runValidators:true, context: 'query' })
    
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})



//errores

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// controlador de solicitudes con endpoint desconocido
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// controlador de solicitudes que resulten en errores
app.use(errorHandler)




const PORT = process.env.PORT
app.listen(PORT, () => {
console.log(`server runin in port ${PORT}`)
})