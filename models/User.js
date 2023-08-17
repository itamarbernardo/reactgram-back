const mongoose = require('mongoose')
const { Schema } = mongoose

//Vamos definir um esquema: O primeiro objeto são os atributos do model, o segundo objeto são as configurações do model
const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    profileImage: String,
    bio: String
}, {
    timestamps: true //Vai criar mais duas colunas: createAt e updateAt (igual no Laravel)

})

const User = mongoose.model('User', userSchema)

module.exports = User