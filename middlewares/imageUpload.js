const multer = require('multer')
const path = require('path')

//Definir o destino da imagem
const imageStore = multer.diskStorage({
    destination: (req, file, callback) => {
        //cb = callback
        let folder = ''

        if(req.baseUrl.includes('users')){
            folder = 'users' //se vier pela url de users
        }else if(req.baseUrl.includes('photos')){
            folder = 'photos'
        }

        callback(null, `uploads/${folder}/`)
    },
    filename: (req, file, callback) => {
      
        callback(null, Date.now() + path.extname(file.originalname))
    },
    
})

const imageUpload = multer({
    storage: imageStore, //Executa a funcao acima
    fileFilter(req, file, callback){
        if(!file.originalname.match(/\.(png|jpg)$/)){
            //upload apenas de .png e .jpg
            return callback(new Error('Por favor, envie apenas fotos em png ou jpg'))
        }
        callback(undefined, true) //Faz o código continuar
    } 
})

module.exports = { imageUpload }