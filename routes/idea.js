const express = require('express')
const idea_controller = require('../controller/idea_controller')
const router = express.Router()

router.post('/registeridea',idea_controller.createIdea);

router.get('/ideas/:teamid',idea_controller.get_idea_students);

module.exports = router;