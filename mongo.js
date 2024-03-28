

// const { MongoClient, ServerApiVersion } = require('mongodb');
const url = "mongodb+srv://jackesm90:070290@noteapp.0nqacca.mongodb.net/noteApp?retryWrites=true&w=majority&appName=noteApp";
const mongoose = require('mongoose');


mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is Easy',
  important: true,
})

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })

Note.find({important:true}).then ( result => {
  result.forEach(note =>{
    console.log(note)
  })
  mongoose.connection.close()
})
