const mongoose = require('mongoose')
const { Schema } = mongoose

const photoSchema = new Schema({
    image: String,
    title: String,
    likes: Array, //quero a quantidade e informações do usuário que deu o link
    comments: Array,
    userId: mongoose.ObjectId, //O tipo tem que ser diff pra guardar o id do usuário
    userName: String
}, {
    timestamps: true
})

const Photo = mongoose.model('Photo', photoSchema)

module.exports = Photo