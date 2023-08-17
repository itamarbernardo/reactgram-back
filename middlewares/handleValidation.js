const { validationResult } = require('express-validator')

const validate = (req, res, next) => {

    const errors = validationResult(req)

    if(errors.isEmpty()){
        return next() //Já vou para o próximo passo, sem erros por aqui
    }

    //Tem erros
    const extractedErros = []
    errors.array().map((err) => extractedErros.push(err.msg)) //Vou mandar pro Front o array de erros pra que possa ser exibido ao usuario

    console.log(extractedErros)
    return res.status(422).json({
        errors: extractedErros
    }) //Retorna o array de erros para o front
}

module.exports = validate