const Photo = require('../models/Photo')
const User = require('../models/User')

const mongoose = require('mongoose')

//Inserir uma foto com usuário relacionado a ela
const insertPhoto = async (req, res) => {
    const {title} = req.body
    const image = req.file.filename

    console.log(req.body)

    const reqUser = req.user
  
    const user = await User.findById(reqUser._id)
  
    console.log(user.name)
  
    // Create a photo
    const newPhoto = await Photo.create({
      image,
      title,
      userId: user._id,
      userName: user.name,
    })
  
    //Se não salvou a foto
    if (!newPhoto) {
      res.status(422).json({errors: ["Houve um erro, por favor tente novamente mais tarde."]})
      return
    }
    
    //Se salvou com sucesso
    res.status(201).json(newPhoto)

}

// Remove a photo from the DB
const deletePhoto = async (req, res) => {
    const { id } = req.params
  
    const reqUser = req.user
  
    try {
        const photo = await Photo.findById(new mongoose.Types.ObjectId(id))
    
        // Checa se a foto existe
        if (!photo) {
        res.status(404).json({ errors: ["Foto não encontrada!"] })
        return
        }
    
        // Checa se o usuário logado que tá tentando excluir é o dono da foto
        if (!photo.userId.equals(reqUser._id)) {
        res.status(422).json({ errors: ["Ocorreu um erro, tente novamente mais tarde"] })
        return
        }
    
        await Photo.findByIdAndDelete(photo._id)
    
        res.status(200).json({ id: photo._id, message: "Foto excluída com sucesso." })

    } catch (error) {
        res.status(404).json({ errors: ["Foto não encontrada. Id Errado"] })
        return        
    }
}

// Get all photos
const getAllPhotos = async (req, res) => {
    const photos = await Photo.find({}) //deixo o objeto vazio pois quero pegar todas
      .sort([["createdAt", -1]]) //Ordena pelos ultimos inseridos (-1) -> quero as fotos mais novas primeiro
      .exec()
  
    return res.status(200).json(photos)
}

// Get photos de um usuario
const getUserPhotos = async (req, res) => {
    //Pego o id pelos parametros da url pois um usuario pode querer ver fotos de outro usuario
    const { id } = req.params
  
    const photos = await Photo.find({ userId: id })
      .sort([["createdAt", -1]])
      .exec()
  
    return res.status(200).json(photos)
}

// Get photo by id
const getPhotoById = async (req, res) => {
    const { id } = req.params
    
    try {
        const photo = await Photo.findById(new mongoose.Types.ObjectId(id))

        // Checa se a foto não existe
        if (!photo) {
            res.status(404).json({ errors: ["Foto não encontrada!"] })
            return
        }
    
        //O return aqui é OPCIONAL  
        res.status(200).json(photo)
    } catch (error) {
        res.status(404).json({ errors: ["Foto não encontrada!"] })
        return        
    }
}

// Update a photo
const updatePhoto = async (req, res) => {
    const { id } = req.params
    const { title } = req.body
    
    const reqUser = req.user
  
    const photo = await Photo.findById(id)
  
    // Checar se a foto existe
    if (!photo) {
      res.status(404).json({ errors: ["Foto não encontrada!"] })
      return
    }
  
    // Checar se a foto pertence ao usuário que quer altera-la
    if (!photo.userId.equals(reqUser._id)) {
      res
        .status(422)
        .json({ errors: ["Ocorreu um erro, tente novamente mais tarde"] })
      return
    }
  
    if (title) {
      photo.title = title;
    }
  
    await photo.save();
  
    res.status(200).json({ photo, message: "Foto atualizada com sucesso!" });
}

//funcionalidade de Like
const likePhoto = async (req, res) => {
    const { id } = req.params;
  
    const reqUser = req.user;
  
    const photo = await Photo.findById(id);
  
    // Checar se a foto existe
    if (!photo) {
      res.status(404).json({ errors: ["Foto não encontrada!"] });
      return;
    }
  
    // Checar se o usuario já deu like na foto
    if (photo.likes.includes(reqUser._id)) {
      res.status(422).json({ errors: ["Você já curtiu esta foto."] });
      return;
    }
  
    //Usuário ainda não curtiu a foto => Coloca o id do usuário no array de likes
    photo.likes.push(reqUser._id);
  
    await photo.save(); //Altera a foto inserindo o dado no array de likes
  
    res.status(200).json({ photoId: id, userId: reqUser._id, message: "A foto foi curtida!" });
};

// Funcionalidade de Comentários
const commentPhoto = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  const reqUser = req.user;

  //busco o usuario completo porque quero outros dados do usuario, como o array de comentarios
  const user = await User.findById(reqUser._id);

  const photo = await Photo.findById(id);

  // Checa se a foto não existe
  if (!photo) {
    res.status(404).json({ errors: ["Foto não encontrada!"] });
    return;
  }

  // cria um comentário com uma serie de informacoes 
  const userComment = {
    comment,
    userName: user.name,
    userImage: user.profileImage,
    userId: user._id,
  };
  //insere o comentario no array de coments
  photo.comments.push(userComment);

  await photo.save();

  res.status(200).json({
    comment: userComment, //Manda o comentário como resposta para que já possamos atualizar no front sem precisar fazer uma nova requisicao de atualizacao de dados
    message: "Comentário adicionado com sucesso!",
  });
};

// Buscar photos pelo titulo
const searchPhotos = async (req, res) => {
  const { q } = req.query;

  const photos = await Photo.find({ title: new RegExp(q, "i") }).exec(); //Essa pesquisa ignora a case sensitive e vai buscar em qualquer lugar da string

  res.status(200).json(photos);
};

module.exports = {
    insertPhoto,
    deletePhoto,
    getAllPhotos,
    getUserPhotos,
    getPhotoById,
    updatePhoto,
    likePhoto,
    commentPhoto,
    searchPhotos,
}