const User = require('../models/User')
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET 

const authGuard = async (req, res, next) => {
    const authHeader = req.headers["authorization"]
    console.log(authHeader)

    //O token vem com o nome do recurso e o token 
    //Ex: Bearer hwhhasdhauhduiheuiey
    //Vamos pegar só a parte do token
    const token = authHeader && authHeader.split(' ')[1]
    console.log('token:', token)
    //Checar se o cabecalho não tem o token 
    if(!token){
        return res.status(401).json({errors: ['Acesso negado!']})
    }

    //Tem token - Checar se o token é valido
    try {
        
        const verified = jwt.verify(token, jwtSecret)

        //Mandados os dados do usuario na requisicao sem a senha
        req.user = await User.findById(verified.id).select('-password') //retira a senha no dado que vai trafegar
        next()
    } catch (error) {
        //Tentou mascarar o token de alguma forma
        res.status(401).json({errors: ['Token Inválido! Acesso negado!']})
    }
}

module.exports = authGuard