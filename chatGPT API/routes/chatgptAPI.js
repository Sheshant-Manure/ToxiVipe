const express = require('express')
const router = express.Router()
const chatGPTController = require('../controllers/chatGPT')

router.post('/classify-toxicity', chatGPTController.classifyToxicity)

module.exports = router