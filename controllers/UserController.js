const User = require('../models/User')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { default: mongoose } = require('mongoose')

const jwtSecret = process.env.JWT_SECRET 

//função pra gerar token - quando o user é registrado, quando faz login
const generateToken = (id) => {
    return jwt.sign({id}, jwtSecret, {
        expiresIn: '7d',
    })
}

//Registrar usuario e sign in
const register = async (req, res) => {

    const {name, email, password} = req.body

    const user = await User.findOne( {email} )
    //Os metodos findOne(), create() são do mongoose

    if (user) {
        res.status(422).json({errors: ['Este email já está cadastrado. Por favor, utilize outro email!']})
        return
    }

    //Generate password hash
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)

    const newUser = await User.create({
        name, 
        email,
        password: passwordHash
    })

    //Checagem se o usuário foi criado com sucesso:
    if(!newUser){
        res.status(422).json({errors: ['Houve um erro. Por favor, tente mais tarde.']})
        return
    }   

    //Se o usuario foi criado com sucesso, retorna o token
    res.status(201).json({
        _id: newUser._id, //Id que acabou de ser gerado pelo mongoose
        token: generateToken(newUser._id)
    }) 
}

const login = async (req, res) => {

    const {email, password} = req.body

    const user = await User.findOne( {email} )
    
    if(!user){
        res.status(404).json({errors: ['Usuário não encontrado.']})
        return 
    }

    if( !(await bcrypt.compare(password, user.password)) ){
        res.status(422).json({errors: ['Senha inválida!']})
        return
    }

    //Se der tudo certo (não entrou em nenhum if) - Retorna o user com o token
    res.status(201).json({
        _id: user._id, 
        profileImage: user.profileImage,
        token: generateToken(user._id)
    }) 
}

const getCurrentUser = async (req, res) => {
    const user = req.user //Mandados os dados do usuario na requisicao no authGuard

    res.status(200).json(user)
}

//Tô atualizando o usuário logado, por isso não preciso passar o id, pois eu tenho o user 
//com o authGuard
const update = async (req, res) => {
    
    const {name, password, bio} = req.body

    let profileImage = null

    if(req.file){
        profileImage = req.file.filename //já acessa a funcao de filename do imageUpload
    }

    const reqUser = req.user //usuario logado no sistema
    //console.log(reqUser)

    const user = await User.findById(new mongoose.Types.ObjectId(reqUser._id)).select('-password')

    if(name){
        user.name = name
    }
    
    if(password){
        //Generate password hash
        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)

        user.password = passwordHash
    }

    if(profileImage){
        user.profileImage = profileImage
    }

    if(bio){
        user.bio = bio
    }

    await user.save()

    res.status(200).json(user)

}

const getUserById = async (req, res) => {
    //Pega o id do usuario pelos parâmetros
    const {id} = req.params

    try {
        const user = await User.findById(new mongoose.Types.ObjectId(id)).select('-password')        
    
        if(!user){
            res.status(404).json({errors: ['Usuário não encontrado.']})
            return 
        }

        res.status(200).json(user)

    } catch (error) {
        res.status(422).json({errors: ['Id Inválido!']})
        return
    }
} 
module.exports = {
    register,
    login,
    getCurrentUser,
    update,
    getUserById,
}