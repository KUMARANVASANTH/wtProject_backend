var express = require("express")
const admin_controller = require('../controller/admin_controller')
var router = express.Router();

router.get('/signin/:email/:pass',admin_controller.signinAdmin)

router.post('/signup',admin_controller.signupAdmin)

router.put('/update/:id',admin_controller.isloggedin,admin_controller.updateAdmin)

router.delete('/delete/:id',admin_controller.isloggedin,admin_controller.deleteAdmin)

module.exports =  router;