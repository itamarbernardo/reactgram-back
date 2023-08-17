const express = require('express')
const router = express.Router()

//Controllers
const { insertPhoto, deletePhoto, getAllPhotos, getUserPhotos, getPhotoById, updatePhoto, likePhoto, commentPhoto, searchPhotos } = require('../controllers/PhotoController')

//Middlewares
const { photoInsertValidation, photoUpdateValidation, commentValidation } = require('../middlewares/photoValidation')
const authGuard = require('../middlewares/authGuard')
const validate = require('../middlewares/handleValidation')
const { imageUpload } = require('../middlewares/imageUpload')

//Routes
router.post('/', authGuard, imageUpload.single('image'), photoInsertValidation(), validate, insertPhoto)
//authGuard = precisa estar autenticado para realizar o insert de photo
//imageUpload.single('image') = faço o upload da imagem, salvo e renomeio o nome do atributo para 'image'
//photoInsertValidation() = faz as validacoes e cria o array de erros
//validates = recebe o array de erros pra mandar pro front
//insertPhoto = função no controller
router.delete('/:id', authGuard, deletePhoto)
router.get('/', authGuard, getAllPhotos)
router.get('/user/:id', authGuard, getUserPhotos)
//router.get('/user/:id', getUserPhotos) //Retirei a necessidade de estar autenticado para obter as fotos de usuários

//Temos que criar essa aqui em cima pra que o parametro "q" não seja confundido com as rotas de baixo
router.get('/search', authGuard, searchPhotos)

router.get('/:id', authGuard, getPhotoById)
router.put('/:id', authGuard, photoUpdateValidation(), validate, updatePhoto)
router.put('/like/:id', authGuard, likePhoto)
router.put('/comment/:id', authGuard, commentValidation(), validate, commentPhoto)


module.exports = router