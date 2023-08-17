const express = require('express')
const router = express.Router()

//Controller
const {register, login, getCurrentUser, update, getUserById} = require('../controllers/UserController')

//Middlewares
const validate = require('../middlewares/handleValidation')
const { userCreateValidation, loginValidation, userUpdateValidation } = require('../middlewares/userValidations')
const authGuard = require('../middlewares/authGuard')
const { imageUpload } = require('../middlewares/imageUpload')

//Rotas
router.post('/register', userCreateValidation(), validate, register) //Acessando o controller com a rota (Semelhante no Laravel)
//Observe que o middleware validate vai exatamente no meio entre a requisicao do usuario e a execucao da acao register
// userCreateValidation -> Vai criar os erros da requisição
// Validate -> Vai resgatar os erros da requisição
router.post('/login', loginValidation(), validate, login) //Acessando o controller com a rota (Semelhante no Laravel)
router.get('/profile', authGuard, getCurrentUser)
router.put('/', authGuard, userUpdateValidation(), validate, imageUpload.single('profileImage'), update)
router.get('/:id', getUserById) //Não precisa de autenticacao, pois qualquer usuario poderia ver o perfil do outro (e trazemos sem senha)

module.exports = router