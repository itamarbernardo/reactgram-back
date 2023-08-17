const { body } = require("express-validator");

const photoInsertValidation = () => {
  return [
    body("title")
      .not().equals("undefined").withMessage("O título é obrigatório") //O formato aqui é formdata (não json), por isso a forma de verificar é diff
      .isString().withMessage("O título é obrigatório")
      .isLength({ min: 3 }).withMessage("O titulo precisa ter no mínimo 3 caracteres."),
    body("image").custom((value, { req }) => {
      if (!req.file) {
        throw new Error("A imagem é obrigatória");
      }
      return true;
    })
  ]
}

const photoUpdateValidation = () => {
  return [
    //OBS: NÃO VALIDAMOS A IMAGEM, POIS ELA NÃO PODE SER ALTERADA, É UMA REGRA DE NEGÓCIO, ASSIM COMO NO INSTAHRAM
    //SE QUISER MUDAR A IMAGEM, EXCLUI E CRIA OUTRA PUBLICACAO
    //IGUAL AO EMAIL QUE NÃO PERMITIMOS ALTERAR NESSA APLICACAO
    body("title")
      .optional()
      .isString().withMessage("O título é obrigatório")
      .isLength({ min: 3 }).withMessage("O nome precisa ter no mínimo 3 caracteres."),
  ];
};

const commentValidation = () => {
  return [body("comment").isString().withMessage("O comentário é obrigatório")];
};

module.exports = {
    photoInsertValidation, 
    photoUpdateValidation,  
    commentValidation,
}