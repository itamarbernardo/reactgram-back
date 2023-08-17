require('dotenv').config() //Pra pegar a porta do arquivo .env

const express = require('express')
const path = require('path')
const cors = require('cors')
const exp = require('constants')

const port = process.env.PORT

const app = express()


//Config resposta em JSON e form data (pra conseguir enviar as imagens) 
app.use(express.json())
app.use(express.urlencoded( { extended: false } ))

//Resolver problema de executar requisições de back e front pelo mesmo domínio - CORS
app.use(cors( {credentials: true, origin: 'http://localhost:3000'} ))
//A origin é o ENDEREÇO de onde vai ficar o frontend da aplicação

//Diretório para Uploads
app.use('/uploads', express.static(path.join(__dirname, '/uploads'))) //define que essa pasta vai ter arquivos estáticos

//Conexao com o Banco de Dados
require('./config/db.js')
//Rotas
const router = require('./routes/Router.js')
app.use(router)

app.listen(port, () => {
    console.log(`App rodando na porta: ${port}`)
})