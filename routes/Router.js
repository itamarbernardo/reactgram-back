const express = require('express')
const router = express()

router.use('/api/users', require('./UserRoutes'))
router.use('/api/photos', require('./PhotoRoutes'))

//Rota de teste
router.get('/', (req, res) => {
    res.send('API trabalhando!!') 
})

module.exports = router